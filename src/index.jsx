/** @jsx createElement */
import createElement from '../createElement.js';
import { render, patch } from '../renderer.js';

let count = 0; 
let oldVNode;

function App({ count }) {
  return (
    <div vedName="container">
      <h1>Count: {count}</h1>
      <button
        onvedsClick={() => {
          count++;
          console.log(count);
          const newVNode = <App count={count} />;
          patch(oldVNode, newVNode, document.getElementById("vedsapp"));
          oldVNode = newVNode;
        }}
      >
        Increment
      </button>
    </div>
  );
}

oldVNode = <App count={count}/>;
render(oldVNode, document.getElementById('vedsapp'));
