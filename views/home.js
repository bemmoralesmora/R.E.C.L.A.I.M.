import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function home() {
  let home = document.createElement("div");
  home.className = "home";

  // Contenedor para el título SVG
  const titleContainer = document.createElement("div");
  titleContainer.className = "title-container";
  home.appendChild(titleContainer);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 800 200");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.classList.add("svg-titulo");
  titleContainer.appendChild(svg);

  const d3svg = d3.select(svg);

  // Ruta en forma de arco más amplio
  d3svg
    .append("path")
    .attr("id", "arcoTitulo")
    .attr("d", "M 100 150 A 300 300 0 0 1 700 150")
    .attr("fill", "none");

  // Texto curvo
  d3svg
    .append("text")
    .attr("class", "titulo")
    .append("textPath")
    .attr("href", "#arcoTitulo")
    .attr("startOffset", "50%")
    .attr("text-anchor", "middle")
    .text("R.E.C.L.A.I.M.");

  // CONTENIDO
  let contenido = document.createElement("div");
  contenido.className = "contenido";
  home.appendChild(contenido);

  let text_c1 = document.createElement("div");
  text_c1.className = "text_c1";
  text_c1.innerHTML = "<h2>Hola, este es un juego acerca de reciclaje</h2>";
  contenido.appendChild(text_c1);

  let img_c = document.createElement("button");
  img_c.className = "img_c";
  img_c.innerHTML = `
    <img src="../assets/personaje.png" alt="">
  `;
  // Añadir evento al botón
  img_c.addEventListener("click", () => {
    // Eliminar el contenido actual
    document.querySelector("#root").innerHTML = "";
    // Cargar el juego principal
    loadMainGame();
  });
  contenido.appendChild(img_c);

  let text_c2 = document.createElement("div");
  text_c2.className = "text_c2";
  text_c2.innerHTML =
    "<h2>Aprende a clasificar los residuos correctamente</h2>";
  contenido.appendChild(text_c2);

  let texto_final = document.createElement("div");
  texto_final.className = "texto_f";
  texto_final.innerHTML =
    "<p>ÚNETE A NUESTRA MISIÓN PARA HACER DEL MUNDO UN LUGAR MÁS LIMPIO</p>";
  home.appendChild(texto_final);

  return home;
}

function loadMainGame() {
  const config = {
    width: 1000,
    height: 360,
    parent: "root", // Cambiado a "root" para que use el mismo contenedor
    type: Phaser.AUTO,
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
      },
    },
  };

  new Phaser.Game(config);
}

function preload() {
  this.load.image("bird", "../assets/bird.png");
  this.load.image("ground", "../assets/ground.png"); // Puedes usar un bloque simple si no tienes esta imagen
  this.load.image("tubo", "../assets/tubo.png")
}

function create() {
  this.pajaro = this.physics.add.sprite(100, 100, "bird");
  this.pajaro.setBounce(0.1);
  this.pajaro.setCollideWorldBounds(true);
  this.pajaro.body.setGravityY(500);

  // Suelo
  this.suelo = this.physics.add.staticGroup();
  this.suelo.create(500, 340, null).setDisplaySize(1000, 30).refreshBody();
  this.add.rectangle(500, 340, 1000, 30, 0x00ff00).setOrigin(0.5);

  // Tubos
  this.tubos = this.physics.add.group(); // Grupo dinámico para mover

  this.tubo1 = this.tubos.create(600, 290, "tubo").setScale(0.5);
  this.tubo2 = this.tubos.create(900, 290, "tubo").setScale(0.5);
  
  this.tubos.children.iterate((tubo) => {
    tubo.setImmovable(true); // Que no se muevan por colisión
    tubo.body.allowGravity = false; // Sin gravedad
    tubo.refreshBody();
  });
  
  this.physics.add.collider(this.pajaro, this.tubos);
  

  // Colisiones
  this.physics.add.collider(this.pajaro, this.suelo);
  this.physics.add.collider(this.pajaro, this.tubos); // Colisión con todos los tubos

  // Controles
  this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.teclaEspacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.saltosDisponibles = 2;
}



function update() {
  // Movimiento con A y D
  if (this.teclaA.isDown) {
    this.pajaro.setVelocityX(-160);
    this.pajaro.setFlipX(true); // 👈 Voltea hacia la izquierda
  } else if (this.teclaD.isDown) {
    this.pajaro.setVelocityX(160);
    this.pajaro.setFlipX(false); // 👈 Mira a la derecha
  } else {
    this.pajaro.setVelocityX(0);
  }

  // Reiniciar doble salto al tocar el suelo
  if (this.pajaro.body.touching.down) {
    this.saltosDisponibles = 2;
  }

  // Salto doble con espacio
  if (Phaser.Input.Keyboard.JustDown(this.teclaEspacio) && this.saltosDisponibles > 0) {
    this.pajaro.setVelocityY(-350);
    this.saltosDisponibles--;
  }

  this.tubos.children.iterate((tubo) => {
    tubo.x -= 2; // Velocidad hacia la izquierda
    if (tubo.x < -50) { // Si sale de pantalla, lo reubicas al final
      tubo.x = 1000;
    }
    tubo.refreshBody(); // Refresca el cuerpo físico
  });
  
}




export { home };