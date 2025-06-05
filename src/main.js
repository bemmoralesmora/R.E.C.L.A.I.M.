import { home } from "../views/home.js";
import { createAnimations } from "./game/animations.js";
import { initAudio, playAudio } from "./game/audio.js";
import { checkControls } from "./game/controls.js";
import { initSpritesheet } from "../services/spritesheets.js";

function dom() {
  let dom = document.querySelector("#root");
  dom.className = "dom";
  dom.appendChild(home());
  return dom;
}

function loadMainGame() {
  if (window.currentGame) {
    window.currentGame.destroy(true);
  }

  const config = {
    autoFocus: false,
    type: Phaser.AUTO,
    width: 2000,
    height: 650,
    backgroundColor: "#808080",
    parent: "root",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: true,
      },
    },
    scene: {
      preload,
      create,
      update,
    },
  };

  window.currentGame = new Phaser.Game(config);
}

function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.image("supermushroom", "assets/collectibles/super-mushroom.png");

  initSpritesheet(this);
  initAudio(this);
}

function create() {
  const { width, height } = this.sys.game.config;
  createAnimations(this);

  // image(x, y, id-del-asset)
  this.add.image(200, 100, "cloud1").setOrigin(0, 0).setScale(0.8);

  this.floor = this.physics.add.staticGroup();

  this.floor
    .create(0, height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  this.floor
    .create(150, height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  this.mario = this.physics.add
    .sprite(50, 100, "mario")
    .setOrigin(0, 1)
    .setScale(2)
    .setCollideWorldBounds(true)
    .setGravityY(300);

  this.enemy = this.physics.add
    .sprite(120, height - 30, "goomba")
    .setOrigin(0, 1)
    .setGravityY(300)
    .setScale(2)
    .setVelocityX(-50);
  this.enemy.anims.play("goomba-walk", true);

  this.collectibles = this.physics.add.staticGroup();
  this.collectibles
    .create(150, 520, "coin")
    .setScale(2)
    .anims.play("coin-idle", true);
  this.collectibles
    .create(300, 520, "coin")
    .setScale(2)
    .anims.play("coin-idle", true);
  this.collectibles
    .create(200, height - 50, "supermushroom")
    .setScale(2)
    .anims.play("supermushroom-idle", true);

  this.physics.add.overlap(
    this.mario,
    this.collectibles,
    collectItem,
    null,
    this
  );

  this.physics.world.setBounds(0, 0, 2000, height);
  this.physics.add.collider(this.mario, this.floor);
  this.physics.add.collider(this.enemy, this.floor);
  this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this);

  this.cameras.main.setBounds(0, 0, 2000, height);
  this.cameras.main.startFollow(this.mario);

  this.keys = this.input.keyboard.createCursorKeys();
}

function collectItem(mario, item) {
  const {
    texture: { key },
  } = item;
  item.destroy();

  if (key === "coin") {
    playAudio("coin-pickup", this, { volume: 0.1 });
    addToScore(100, item, this);
  } else if (key === "supermushroom") {
    this.physics.world.pause();
    this.anims.pauseAll();

    playAudio("powerup", this, { volume: 0.1 });

    let i = 0;
    const interval = setInterval(() => {
      i++;
      mario.anims.play(i % 2 === 0 ? "mario-grown-idle" : "mario-idle");
    }, 100);

    mario.isBlocked = true;
    mario.isGrown = true;

    setTimeout(() => {
      mario.setDisplaySize(18, 32);
      mario.body.setSize(18, 32);
      mario.setScale(2);

      this.anims.resumeAll();
      mario.isBlocked = false;
      clearInterval(interval);
      this.physics.world.resume();
    }, 1000);
  }
}

function addToScore(scoreToAdd, origin, game) {
  const config = game.sys.game.config;
  const scoreText = game.add.text(origin.x, origin.y, scoreToAdd, {
    fontFamily: "pixel",
    fontSize: config.width / 40,
  });

  game.tweens.add({
    targets: scoreText,
    duration: 500,
    y: scoreText.y - 20,
    onComplete: () => {
      game.tweens.add({
        targets: scoreText,
        duration: 100,
        alpha: 0,
        onComplete: () => {
          scoreText.destroy();
        },
      });
    },
  });
}

function onHitEnemy(mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up) {
    enemy.anims.play("goomba-hurt", true);
    enemy.setVelocityX(0);
    mario.setVelocityY(-200);

    playAudio("goomba-stomp", this);
    addToScore(200, mario, this);

    setTimeout(() => {
      enemy.destroy();
    }, 500);
  } else {
    killMario(this);
  }
}

function update() {
  const { mario } = this;
  const { height } = this.sys.game.config;

  checkControls(this);

  // check if mario is dead
  if (mario.y >= height) {
    killMario(this);
  }
}

function killMario(game) {
  const { mario, scene } = game;

  if (mario.isDead) return;

  mario.isDead = true;
  mario.anims.play("mario-dead");
  mario.setCollideWorldBounds(false);

  playAudio("gameover", game, { volume: 0.05 });

  mario.body.checkCollision.none = true;
  mario.setVelocityX(0);

  setTimeout(() => {
    mario.setVelocityY(-250);
  }, 100);

  setTimeout(() => {
    scene.restart();
  }, 2000);
}

dom();
export { loadMainGame };
