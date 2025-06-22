import { patch } from "./renderer.js";
const hookStateMap = new WeakMap();

export let currentComponent = null;
export let currentHookIndex = 0;

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

  const setState = ((i, component) => (newValue) => {
    const states = hookStateMap.get(component);
    if (states[i] !== newValue) {
      states[i] = newValue;
      const parent = component._container;
      currentComponent = component;
      currentHookIndex = 0;
      const newVNode = component.type(component.props);
      newVNode._container = parent;
      patch(component._rendered, newVNode, parent);
      component._rendered = newVNode;
    }
  })(index, currentComponent);

  currentHookIndex++;
  return [stateArray[index], setState];
}