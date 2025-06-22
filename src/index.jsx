/** @jsx createElement */
import createElement from './createElement.js';
import { render } from './renderer.js';
import { useState } from './hooks.js';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div vedName="container">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

const vnode = <App />;
render(vnode, document.getElementById("vedsapp"));