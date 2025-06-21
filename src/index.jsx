/** @jsx createElement */
import createElement from './createElement.js';
import { render } from './renderer.js';

function App() {
  return (
    <div vedName="container">
      <h1>Hello JSX to VDOM</h1>
      <button onvedsClick={() => alert("Ved clicked!")} className="btn">
        Click Me
      </button>
    </div>
  );
}


const vnode = <App />;
render(vnode, document.getElementById('vedsapp'));