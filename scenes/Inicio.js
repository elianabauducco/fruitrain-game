export default class Inicio extends Phaser.Scene {
    constructor () {
       super ("Inicio");
    }

    preload() {
        this.load.image("Inicio", "./public/assets/Inicio.png");
        this.load.image("startButton", "./public/assets/startButton.png");
        this.load.image("banana", "./public/assets/banana.png");
        this.load.image("limon", "./public/assets/limon.png");
        this.load.image("naranja", "./public/assets/naranja.png");
        this.load.image("frutilla", "./public/assets/frutilla.png");
        this.load.image("narOR", "public/assets/narOR.png");
        this.load.image("limOR", "public/assets/limOR.png");
        this.load.image("frutOR", "public/assets/frutOR.png");
        this.load.image("banOR", "public/assets/banOR.png");
    }

    create (){

        this.recolectables = this.physics.add.group();

        this.time.addEvent({
            delay: 900,
            callback: this.onSecond,
            callbackScope: this,
            loop: true,
        });

        this.add.image(300, 330, "Inicio").setScale(0.9);
       
        //boton de start
        const startButton = this.add.image( 315, 380, "startButton").setScale(0.75).setVisible(true);
        
        startButton.setInteractive({cursor: 'pointer'});
        startButton.on('pointerover', () => {
            startButton.setScale(0.70);
        });

        startButton.on('pointerout', () => {
            startButton.setScale(0.75);
        })

        startButton.on ('pointerdown', () => {
            this.scene.start('main');

        });


    }

    onSecond (){

        const tipos = ["frutilla", "banana", "limon", "naranja", "frutOR", "limOR", "narOR", "banOR"];
        const tipo = Phaser.Math.RND.pick(tipos);
        let recolectable = this.recolectables.create(
            Phaser.Math.Between(10, 790),
            0,
            tipo
        );
        recolectable.setVelocity(0, 230);
        recolectable.setScale(1);
    }
}