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

export { home };
