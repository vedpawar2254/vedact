/** @jsx createElement */
import createElement from './createElement.js';
import { render } from './renderer.js';
import { useState } from './hooks.js';

export const App = () => {
  const [name, setName] = useState('ved');
  const [count, setCount] = useState(0);
  return (
    <div draggable>
      <h2>Hello {name}!</h2>
      <p>I am a pargraph</p>
      <input
        type="text"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />
      <h2> Counter value: {count}</h2>
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
    </div>
  );
};


const rootElement = document.getElementById('vedsapp');
rootElement.innerHTML = ''; 
render(<App />, rootElement);