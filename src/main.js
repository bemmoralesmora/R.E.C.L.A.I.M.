import { home } from "../views/home.js";
function dom() {
  let dom = document.querySelector("#root");
  dom.className = "dom";
  dom.appendChild(home());
  return dom;
}

dom();

export { dom };
