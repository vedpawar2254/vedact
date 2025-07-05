# vedact
 
My own react, for learning purposes.

run `npm i && npm run build && npm run start`


## ✅ **📚 What should your `vedact` docs include?**

Here’s an outline that works for a **tiny React-like library**:

---

### 🏷️ 1️⃣ **Introduction**

**What is VedAct?**

> VedAct is a tiny experimental React-like library that lets you build UI with a virtual DOM, hooks (`useState`, `useEffect`), and a simple renderer — in **just a few kilobytes**.
>
> Inspired by React’s functional components and hooks API, but small and hackable.

**Why?**

* To learn how React works internally.
* To build simple UIs with your own custom rendering pipeline.
* To try your own ideas — scheduling, diffing, new hooks, etc.

---

### ⚡ 2️⃣ **Installation**

Example for npm:

```bash
npm install vedact
```

Or for development:

```bash
git clone https://github.com/yourusername/vedact.git
cd vedact
npm install
```

---

### 🔑 3️⃣ **API Reference**

Show exactly **what people can import**:

```js
import {
  createElement,
  render,
  useState,
  useEffect
} from 'vedact';
```

| Function        | Description                                         |
| --------------- | --------------------------------------------------- |
| `createElement` | Creates a virtual DOM node (used internally by JSX) |
| `render`        | Renders a virtual DOM node to a real DOM container  |
| `useState`      | React-like state hook                               |
| `useEffect`     | React-like effect hook                              |

Optional: expose `Fragment` if you want to support multiple children.

---

### ⚛️ 4️⃣ **Quick Start**

**1️⃣ Create a component**

```js
import { createElement, useState, useEffect } from 'vedact';

function App(props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Mounted or count changed:', count);
    return () => console.log('Cleanup');
  }, [count]);

  return createElement('div', null,
    createElement('h1', null, `Count: ${count}`),
    createElement('button', { onClick: () => setCount(count + 1) }, 'Increment')
  );
}
```

**2️⃣ Render it**

```js
import { render } from 'vedact';

render(createElement(App), document.getElementById('root'));
```

**3️⃣ Or with JSX:**

```jsx
/** @jsx createElement */
import { createElement, render } from 'vedact';

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
```

---

### ⚙️ 5️⃣ **How It Works (High-level)**

Give devs confidence that it’s not magic:

> * VedAct builds a **virtual DOM** tree using `createElement`.
> * When you call `render`, it converts the virtual DOM to real DOM nodes.
> * `useState` stores state in a WeakMap tied to each component instance.
> * `useEffect` runs after each render if dependencies change.
> * `setState` triggers a diffing `patch` to update the DOM.

---

### ⚡ 6️⃣ **Folder Structure for Contributors**

If you want contributors, include this too:

```txt
vedact/
├── src/
│   ├── core/         # createElement, render, patch
│   ├── hooks/        # useState, useEffect, prepareHooks
│   ├── shared/       # constants, symbols
│   ├── index.js      # Public API entry point
├── examples/         # Example apps
├── package.json
```

---

### 📖 7️⃣ **FAQ**

**Q: Can I use this in production?**
A: No! This is experimental — meant for learning and tinkering.

**Q: Does it support class components?**
A: Not yet — only function components.

**Q: Does it have a diffing algorithm?**
A: Basic patching, not as optimized as React’s Fiber. Contributions welcome!

---

### ✅ 8️⃣ **Next Steps**

Optionally add a `ROADMAP.md`:

* [ ] Add `useReducer`, `useMemo`
* [ ] Optimize `patch` to diff children
* [ ] Implement `Fragment`
* [ ] Add `createRoot` and concurrent rendering

---

## 📌 **Ready-to-go README.md Example**

Here’s a **realistic minimal README** for your repo:

````md
# 🧩 VedAct

VedAct is a tiny React-like virtual DOM library with hooks.  
**Build, render, and experiment with your own React internals!**

---

## 📦 Install

```bash
npm install vedact
````

---

## ⚛️ Quick Example

```jsx
/** @jsx createElement */
import { createElement, render, useState } from 'vedact';

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
```

---

## 📚 API

* `createElement(type, props, ...children)`
* `render(vnode, container)`
* `useState(initialValue)`
* `useEffect(callback, deps)`

---

## ⚙️ How It Works

* Virtual DOM tree → real DOM nodes.
* Hooks store state per component.
* `setState` triggers patching & DOM updates.
* `useEffect` runs when dependencies change.

---

## 🛠️ For Hackers

Folder structure:

```
src/
  core/       # createElement, render, patch
  hooks/      # useState, useEffect
  shared/     # constants & symbols
  index.js    # Entry point
examples/     # Example apps
```

---

**🚀 Not production-ready — built for learning!**

Contributions welcome!

```

---

## ✅ **When your README is done, you can:**

1. Publish to GitHub.
2. Add the `main` field in `package.json` pointing to your `dist/index.js`.
3. Run `npm publish`.

And that’s it — you have your own React clone, **properly structured, documented, and publishable**.

---

## 🔥 Next:  
When you’ve drafted your README + structure, paste it here — I’ll review it like a senior dev would.  
Ready?
```


great thanks to [this article](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-2-state-management-and-react-hooks-e771c5c06066)
