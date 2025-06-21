/** @jsx createElement */
import createElement from './createElement.js';
import { render } from './renderer.js';
function App() {
  return createElement("div", {
    vedName: "container"
  }, createElement("h1", null, "Hello JSX to VDOM"), createElement("button", {
    onvedsClick: function onvedsClick() {
      return alert("Ved clicked!");
    },
    className: "btn"
  }, "Click Me"));
}
var vnode = createElement(App, null);
render(vnode, document.getElementById('vedsapp'));
