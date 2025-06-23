import { patch } from "./renderer.js";
import {effectStore} from "./constants.js"
const hookStateMap = new WeakMap();


export let currentComponent = null;
export let currentHookIndex = 0;

function areDepsEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}



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


export function useEffect(callback, deps) {
  const effectIndex = currentHookIndex;
  
  if (!effectStore.has(currentComponent)) {
    effectStore.set(currentComponent, []);
  }
  const effects = effectStore.get(currentComponent);
  
  const oldEffect = effects[effectIndex];
  const hasChanged = !oldEffect || !areDepsEqual(oldEffect.deps, deps);
  
  if (hasChanged) {
    // Run cleanup first if exists
    if (oldEffect?.cleanup) {
      oldEffect.cleanup();
    }
    
    // Store the callback AND potential cleanup
    const effect = {
      callback,  // Store the callback function
      deps,
      cleanup: null
    };
    
    // Execute callback and store cleanup
    effect.cleanup = callback();
    effects[effectIndex] = effect;
  }
  
  currentHookIndex++;
}