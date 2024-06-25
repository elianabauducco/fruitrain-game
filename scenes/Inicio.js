export default class Inicio extends Phaser.Scene {
    constructor () {
       super ("Inicio");
    }

    preload() {
        this.load.image("Inicio", "./public/assets/Inicio.png");
        this.load.image("startButton", "./public/assets/startButton.png");
    }

    create (){

        this.add.image(300, 330, "Inicio").setScale(1.45);
       
        //boton de start
        const startButton = this.add.image( 300, 330, "startButton").setScale(0.3).setVisible(true);
        
        startButton.setInteractive({cursor: 'pointer'});
        startButton.on('pointerover', () => {
            startButton.setSCale(0.45);
        });

        startButton.on ('pointerdown', () => {
            this.scene.start('main');

        });


    }
}