/** @jsx createElement */
import { createElement, render, useState } from '../src/index.js';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

render(<Counter />, document.getElementById('root'));