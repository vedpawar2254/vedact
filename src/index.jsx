/** @jsx createElement */
import createElement from './createElement.js';
import { render } from './renderer.js';
import { useState } from './hooks.js';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Count: {count}</h1>
      <button onClick={() => {
        console.log('Click! Current count:', count);
        setCount(count + 1);
      }}>Increment</button>
    </div>
  );
}


const rootElement = document.getElementById('vedsapp');
rootElement.innerHTML = ''; 
render(<App />, rootElement);