const config = {
  width: 1000,
  height: 360,
  parent: "container",
  type: Phaser.AUTO,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      //gravity: { y: 500 },
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("bird", "../assets/bird.png");
}

function create() {
  this.pajaro = this.physics.add.sprite(100, 50, "bird");
  this.pajaro.setCollideWorldBounds(true);

  /*
    this.input.keyboard.on("keydown-RIGHT", () => {
        this.pajaro.setVelocityX(200);
    });

    this.input.keyboard.on("keyup-RIGHT", () => {
        this.pajaro.setVelocityX(0);
    });
    */

  //this.cursor = this.input.keyboard.createCursorKeys();

  this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
}

function update() {
  // Opcional: lógica de juego
  if (this.right.isDown) {
    this.pajaro.x++;
  } else if (this.left.isDown) {
    this.pajaro.x--;
  }
}
