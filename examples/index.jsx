/** @jsx createElement */
import createElement from './core/createElement.js';
import { render } from './core/renderer.js';
import { useState,useEffect } from './hooks/hooks.js';
// import { Button } from './component/button.jsx';

export const App = () => {
  const [name, setName] = useState('ved');
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted!');
    return () => console.log('Component unmounted!');
  }, []);

  useEffect(() => {
    console.log(`Count changed to: ${count}`);
    
    return () => {
      console.log(`Cleaning up count: ${count}`);
    };
  }, [count]);
  return (
    <div>
      <h2>Hello {name}!</h2>
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