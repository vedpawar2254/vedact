import { patch } from './renderer.js';

export let currentComponent = null;
export let currentHookIndex = 0;

const hookStateMap = new WeakMap(); 

export function prepareHooks(componentVNode) {
  currentComponent = componentVNode;
  currentHookIndex = 0;
  if (!hookStateMap.has(componentVNode)) {
    hookStateMap.set(componentVNode, []);
  }
}

export function useState(initialValue) {
  const stateArray = hookStateMap.get(currentComponent);
  const index = currentHookIndex;

  if (stateArray[index] === undefined) {
    stateArray[index] = initialValue;
  }

  function setState(newValue) {
    stateArray[index] = newValue;
    const parent = currentComponent._container;
    const newVNode = currentComponent.type(currentComponent.props);
    newVNode._container = parent;
    patch(currentComponent._rendered, newVNode, parent);
    currentComponent._rendered = newVNode;
  }

  const value = stateArray[currentHookIndex];
  currentHookIndex++;
  return [value, setState];
}
