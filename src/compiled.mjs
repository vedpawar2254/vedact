/** @jsx createElement */
import createElement from '../createElement.js';
import { render, patch } from '../renderer.js';
var count = 0;
var oldVNode;
function App(_ref) {
  var count = _ref.count;
  return createElement("div", {
    vedName: "container"
  }, createElement("h1", null, "Count: ", count), createElement("button", {
    onvedsClick: function onvedsClick() {
      count++;
      console.log(count);
      var newVNode = createElement(App, {
        count: count
      });
      patch(oldVNode, newVNode, document.getElementById("vedsapp"));
      oldVNode = newVNode;
    }
  }, "Increment"));
}
oldVNode = createElement(App, {
  count: count
});
render(oldVNode, document.getElementById('vedsapp'));
