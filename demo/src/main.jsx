/** @jsx createElement */
import { createElement, render } from '../../dist/index.js';
import { useState } from '../../dist/hooks/index.js';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

render(<App />, document.getElementById('root'));