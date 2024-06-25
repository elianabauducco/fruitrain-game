import End from "./scenes/End.js";
import Game from "./scenes/Game.js";

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 700,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      min: {
        width: 600,
        height: 700,
      },
      max: {
        width: 1600,
        height: 1200,
      },
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200, },
        debug: false,
      },
    },
    scene: [Game,End],
};

window.game = new Phaser.Game(config);