export default class Game extends Phaser.Scene {
    constructor() {
        super("main");
    }

    init() {
        this.gameOver = false;
        this.score = 0;
        this.shapes = {
            limon: { count: 0, points: 10 },
            banana: { count: 0, points: 10 },
            naranja: { count: 0, points: 10 },
            frutilla: { count: 0, points: 10 },
        };
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

        //imágenes de botones
        this.load.image("ORButton", "public/assets/ORButton.png");
        this.load.image("backButton", "public/assets/backButton.png");
        this.load.image("REButton", "public/assets/REButton.png");

        //imagenes pop-ups
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

        this.personaje = this.physics.add.sprite(400, 100, "personaje");
        this.personaje.setScale(0.6);

        this.physics.add.collider(this.personaje, this.rectangulo);

        this.cursor = this.input.keyboard.createCursorKeys();

        this.recolectables = this.physics.add.group();

        this.physics.add.collider(
            this.personaje,
            this.recolectables,
            this.onShapeCollect,
            null,
            this
        );

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
            this.onRecolectableBounced,
            null,
            this
        );

        // imágenes de las iniciales
        this.fImage = this.add.image(30, 50, "F").setScale(0.3).setVisible(true);
        this.bImage = this.add.image(30, 90, "B").setScale(0.4).setVisible(true);
        this.lImage = this.add.image(30, 140, "L").setScale(0.3).setVisible(true);
        this.nImage = this.add.image(30, 190, "N").setScale(0.2).setVisible(true);

        // Inicializar contadores
        this.shapes["frutilla"].image = this.fImage;
        this.shapes["banana"].image = this.bImage;
        this.shapes["limon"].image = this.lImage;
        this.shapes["naranja"].image = this.nImage;

        //grupo de pop-ups
        this.popups = this.add.group();

        //boton de pedidos
        this.ORButton = this.add.image(560, 150, "ORButton").setInteractive().setScale(0.5).setVisible(true);
        this.ORButton.on('pointerup', () => this.showPopup('OR'), this);

        //boton de recetas
        this.REButton = this.add.image(60, 650, "REButton").setInteractive().setScale(0.4).setVisible(true);
        this.REButton.on('pointerup', () => this.showPopup('RE'), this);

        //pop-ups pero mantenerlos ocultos inicialmente
        this.popupOR = this.add.image(300, 300, "popupOR").setVisible(false).setDepth(2).setScale(1.7);
        this.popupRE = this.add.image(300, 300, "popupRE").setVisible(false).setDepth(2).setScale(1.7);
        this.backButton = this.add.image(300, 390, "backButton").setInteractive().setScale(0.8).setVisible(false).setDepth(2);
        this.backButton.on('pointerdown', this.hidePopup, this);
        this.backREButton = this.add.image(300, 390, "backButton").setInteractive().setScale(0.8).setVisible(false).setDepth(2);
        this.backREButton.on('pointerdown', this.hidePopup, this);
    }

    update() {
        if (this.gameOver && this.r.isDown) {
            this.scene.restart();
        }
        if (this.gameOver) {
            this.physics.pause();
            this.scoreText.setText("Game Over");
            return;
        }

        if (this.cursor.left.isDown) {
            this.personaje.setVelocityX(-200);
        } else if (this.cursor.right.isDown) {
            this.personaje.setVelocityX(200);
        } else {
            this.personaje.setVelocityX(0);
        }
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
        recolectable.setVelocity(0, 100);
        recolectable.setScale(0.10);

        recolectable.setData("points", this.shapes[tipo].points);
        recolectable.setData("tipo", tipo);
    }

    createPopup(text, x, y) {
        const popup = this.add.text(x, y, text, { fontSize: '32px', fill: '#000000', backgroundColor: '#ffffff' })
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1); 

        this.popups.add(popup);

        // Animar el pop-up
        this.tweens.add({
            targets: popup,
            alpha: { from: 1, to: 0 },
            y: y - 50,
            ease: 'Cubic.easeOut',
            duration: 1000,
            onComplete: () => {
                popup.destroy();
            }
        });
    }

    onShapeCollect(personaje, recolectable) {
        const nombreFig = recolectable.getData("tipo");
        const points = recolectable.getData("points");

        this.score += points;
        this.shapes[nombreFig].count += 1;

        console.table(this.shapes);
        console.log("recolectado ", recolectable.texture.key, points);
        console.log("score ", this.score);
        recolectable.destroy();

        this.scoreText.setText(`Puntaje: ${this.score}`);

        // Mostrar el pop-up de puntos
        this.createPopup(`+${points} pts`, recolectable.x, recolectable.y);

        const shape = this.shapes[nombreFig];
        if (shape.count > 0) {
            shape.image.setVisible(true);
        }
        
        this.checkWin();
    }

    showPopup(type) {
        if (type === 'OR') {
            this.popupOR.setVisible(true);
            this.backButton.setVisible(true);
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
    }

    checkWin() {
        const cumplePuntos = this.score >= 100;
        const cumpleFiguras = this.shapes.limon.count > 0 && this.shapes.banana.count > 0 && this.shapes.naranja.count > 0 && this.shapes.frutilla.count > 0;

        if (cumplePuntos && cumpleFiguras) {
            this.gameOver = true;
        }
    }
}

