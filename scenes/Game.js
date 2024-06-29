export default class Game extends Phaser.Scene {
    constructor() {
        super("main");
    }

    init() {
        this.gameOver = false;
        this.limiteFrutas = 10; // Establecer el límite de frutas
        this.shapes = {
            limon: { count: 0, points: 0, limit: this.limiteFrutas },
            banana: { count: 0, points: 0, limit: this.limiteFrutas },
            naranja: { count: 0, points: 0, limit: this.limiteFrutas },
            frutilla: { count: 0, points: 0, limit: this.limiteFrutas },
        };

        this.pedidos = [
            { name: "Batido de Frutilla", type: "frutilla", required: 5, image: "batidoFrutilla" },
            { name: "Batido de Banana", type: "banana", required: 3, image: "batidoBanana" },
            { name: "Jugo de Naranja", type: "naranja", required: 4, image: "jugoNaranja" },
            { name: "Limonada", type: "limon", required: 2, image: "limonada" }
        ];
        this.pedidoActual = null;
    }

    preload() {
        this.load.image("cielo", "public/assets/cielo.png");
        this.load.image("pasto", "public/assets/pasto.png");
        this.load.image("personaje", "./public/assets/personaje.png");
        this.load.image("banana", "./public/assets/banana.png");
        this.load.image("limon", "./public/assets/limon.png");
        this.load.image("naranja", "./public/assets/naranja.png");
        this.load.image("frutilla", "./public/assets/frutilla.png");
        this.load.image("rectangulo", "/public/assets/rectangulo-png.png");

        this.load.image("F", "./public/assets/F.png");
        this.load.image("B", "./public/assets/B.png");
        this.load.image("L", "./public/assets/L.png");
        this.load.image("N", "./public/assets/N.png");

        this.load.image("batidoFrutilla", "public/assets/frutOR.png");
        this.load.image("batidoBanana", "public/assets/banOR.png");
        this.load.image("jugoNaranja", "public/assets/narOR.png");
        this.load.image("limonada", "public/assets/limOR.png");

        this.load.image("ORButton", "public/assets/ORButton.png");
        this.load.image("backButton", "public/assets/backButton.png");
        this.load.image("REButton", "public/assets/REButton.png");
        this.load.image("menuButton", "public/assets/menuButton.png");

        this.load.image("popupOR", "public/assets/popupOR.png");
        this.load.image("popupRE", "public/assets/popupRE.png");
    }

    create() {
        this.cielo = this.add.image(300, 400, "cielo");
        this.cielo.setScale(0.7);

        this.pasto = this.physics.add.staticGroup();
        this.pasto.create(400, 650, "pasto").setScale(1.2).refreshBody();

        this.rectangulo = this.physics.add.staticGroup();
        this.rectangulo.create(400, 690, "rectangulo").setScale(1.2).refreshBody();

        this.personaje = this.physics.add.sprite(400, 565, "personaje");
        this.personaje.setScale(0.6);

        this.physics.add.collider(this.personaje, this.rectangulo);

        this.cursor = this.input.keyboard.createCursorKeys();

        this.recolectables = this.physics.add.group();

        this.physics.add.overlap(this.personaje, this.recolectables, this.onShapeCollect, null, this);

        this.time.addEvent({
            delay: 1000,
            callback: this.onSecond,
            callbackScope: this,
            loop: true,
        });

        this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.physics.add.collider(
            this.recolectables,
            this.rectangulo,
            this.onRecolectableHitPlatform,
            null,
            this
        );

        // imágenes de las iniciales
        this.fImage = this.add.image(30, 50, "F").setScale(0.7).setVisible(true);
        this.bImage = this.add.image(30, 90, "B").setScale(0.8).setVisible(true);
        this.lImage = this.add.image(30, 140, "L").setScale(0.8).setVisible(true);
        this.nImage = this.add.image(30, 190, "N").setScale(0.7).setVisible(true);

        // contadores de frutas
        this.shapes["frutilla"].image = this.fImage;
        this.shapes["banana"].image = this.bImage;
        this.shapes["limon"].image = this.lImage;
        this.shapes["naranja"].image = this.nImage;

        this.shapes["frutilla"].text = this.add.text(70, 40, '0', { fontSize: '35px', fill: '#000' });
        this.shapes["banana"].text = this.add.text(70, 80, '0', { fontSize: '35px', fill: '#000' });
        this.shapes["limon"].text = this.add.text(70, 130, '0', { fontSize: '35px', fill: '#000' });
        this.shapes["naranja"].text = this.add.text(70, 180, '0', { fontSize: '35px', fill: '#000' });

        // grupo de pop-ups
        this.popups = this.add.group();

        // botón de menú
        this.menuButton = this.add.image(550, 40, "menuButton").setInteractive().setScale(0.12).setVisible(true);
        this.menuButton.on('pointerover', () => {
            this.menuButton.setScale(0.10);
        });

        this.menuButton.on('pointerout', () => {
            this.menuButton.setScale(0.12);
        });

        this.menuButton.on('pointerdown', () => {
            this.scene.start('Inicio');
        });

        // botón de pedidos
        this.ORButton = this.add.image(560, 150, "ORButton").setInteractive().setScale(1).setVisible(true);
        this.ORButton.on('pointerup', () => this.showPopup('OR'), this);
        this.ORButton.on('pointerover', () => {
            this.ORButton.setScale(0.95);
        });

        this.ORButton.on('pointerout', () => {
            this.ORButton.setScale(1);
        });

        // botón de recetas
        this.REButton = this.add.image(60, 650, "REButton").setInteractive().setScale(1).setVisible(true);
        this.REButton.on('pointerup', () => this.showPopup('RE'), this);
        this.REButton.setInteractive({ cursor: 'pointer' });
        this.REButton.on('pointerover', () => {
            this.REButton.setScale(0.95);
        });

        this.REButton.on('pointerout', () => {
            this.REButton.setScale(1);
        });

        // pop-ups pero ocultos inicialmente
        this.popupOR = this.add.image(300, 300, "popupOR").setVisible(false).setDepth(2).setScale(1.9);
        this.popupRE = this.add.image(300, 300, "popupRE").setVisible(false).setDepth(2).setScale(1.9);
        this.backButton = this.add.image(300, 440, "backButton").setInteractive().setScale(0.8).setVisible(false).setDepth(2);
        this.backButton.on('pointerdown', this.hidePopup, this);
        this.backButton.on('pointerover', () => {
            this.backButton.setScale(0.75);
        });

        this.backButton.on('pointerout', () => {
            this.backButton.setScale(0.8);
        });

        this.backREButton = this.add.image(300, 400, "backButton").setInteractive().setScale(0.8).setVisible(false).setDepth(2);
        this.backREButton.on('pointerdown', this.hidePopup, this);
        this.backREButton.on('pointerover', () => {
            this.backREButton.setScale(0.75);
        });

        this.backREButton.on('pointerout', () => {
            this.backREButton.setScale(0.8);
        });

        this.pedidoImagenOR = this.add.image(300, 300, "").setVisible(false).setDepth(3).setScale(0.6);

        this.time.addEvent({
            delay: 10500,
            callback: this.generarPedido,
            callbackScope: this,
            loop: true,
        });
    }

    generarPedido() {
        const pedido = Phaser.Math.RND.pick(this.pedidos);
        this.pedidoActual = pedido;
        this.mostrarPedido();
    }

    mostrarPedido() {
        if (this.pedidoImagenOR) {
            this.pedidoImagenOR.setTexture(this.pedidoActual.image).setVisible(true);
        }
    }

    update() {
        if (this.gameOver && this.r.isDown) {
            this.scene.restart();
        }
        if (this.gameOver) {
            this.physics.pause();
            return;
        }

        if (this.cursor.left.isDown) {
            this.personaje.setVelocityX(-200);
        } else if (this.cursor.right.isDown) {
            this.personaje.setVelocityX(200);
        } else {
            this.personaje.setVelocityX(0);
        }

        // destruir recolectables al tocar la plataforma
        this.recolectables.getChildren().forEach(recolectable => {
            if (recolectable.y > this.rectangulo.y) {
                recolectable.destroy();
            }
        });
    }

    onSecond() {
        if (this.gameOver) {
            return;
        }
        const tipos = ["frutilla", "banana", "limon", "naranja"];
        const tipo = Phaser.Math.RND.pick(tipos);
        let recolectable = this.recolectables.create(
            Phaser.Math.Between(10, 790),
            0,
            tipo
        );
        recolectable.setVelocity(0, 230);
        recolectable.setScale(1);

        recolectable.setData("points", this.shapes[tipo].points);
        recolectable.setData("tipo", tipo);
    }

    onShapeCollect(personaje, recolectable) {
        const tipo = recolectable.getData("tipo");
        const shape = this.shapes[tipo];

        if (shape.count < shape.limit) {
            shape.count += 1;
            recolectable.destroy();
            shape.text.setText(shape.count);

            if (this.pedidoActual && tipo === this.pedidoActual.type) {
                if (shape.count >= this.pedidoActual.required) {
                    this.pedidoCompleto();
                }
            }

        } else {
            recolectable.destroy(); // desaparece fruta si alcanza el límite
        }

        // contador de frutas
        if (shape.count > 0) {
            shape.image.setVisible(true);
        }
    }

    pedidoCompleto() {
        this.add.text(155, 200, '¡COMPLETED!', { fontSize: '30px', fill: '#ff8000' });
        this.time.delayedCall(2000, () => {
            if (this.pedidoImagen) {
                this.pedidoImagen.destroy();
            }
            if (this.pedidoTexto) {
                this.pedidoTexto.destroy();
            }
        });

        this.pedidoActual = null;
    }

    onRecolectableHitPlatform(recolectable, platform) {
        recolectable.destroy();
    }

    showPopup(type) {
        if (type === 'OR') {
            this.popupOR.setVisible(true);
            this.backButton.setVisible(true);
            if (this.pedidoActual) {
                this.pedidoImagenOR.setTexture(this.pedidoActual.image).setVisible(true);
                this.pedidoTextoOR.setText(`${this.pedidoActual.name}: ${this.pedidoActual.required}`).setVisible(true);
            }

        } else if (type === 'RE') {
            this.popupRE.setVisible(true);
            this.backREButton.setVisible(true);
        }
    }

    hidePopup() {
        this.popupOR.setVisible(false);
        this.popupRE.setVisible(false);
        this.backButton.setVisible(false);
        this.backREButton.setVisible(false);
        this.pedidoImagenOR.setVisible(false);
        this.pedidoTextoOR.setVisible(false);
    }
}




