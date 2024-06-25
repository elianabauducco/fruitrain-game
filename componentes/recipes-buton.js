export class Recetas {
    
    constructor (scene) {
        this.related = scene ;

    }

    preload () {
        this.relatedScene.load.spritesheet("recipes", "")

    }

    create () {
        this.recipesButton = this.relatedScene.add.sprite (400, 300 "recipes").setInteractive ();
        
    }
}