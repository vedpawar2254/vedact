import { patch } from "../core/patch.js";
import { effectStore } from "../shared/constants.js";

export const hookStateMap = new WeakMap();

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

  if (!componentVNode.hookState) {
    componentVNode.hookState = [];
  }
}

export function useState(initialValue) {
  const stateArray = currentComponent.hookState;
  const index = currentHookIndex;

  if (stateArray[index] === undefined) {
    stateArray[index] = initialValue;
  }

  const setState = (newValue) => {
    const states = currentComponent.hookState;
    const resolvedValue = typeof newValue === 'function'
      ? newValue(states[index])
      : newValue;
  
    if (states[index] !== resolvedValue) {
      states[index] = resolvedValue;
      const oldVNode = currentComponent._rendered;

  
      const parent = currentComponent._container;
      const newVNode = currentComponent.type(currentComponent.props);
      newVNode._container = parent;
  
      newVNode.hookState = currentComponent.hookState; 
      prepareHooks(newVNode);                         
  
      patch(oldVNode, newVNode, parent);
      currentComponent._rendered = newVNode;
  
      console.log("setState called, newVNode:", newVNode);
    }
  };
  

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
    if (oldEffect?.cleanup) {
      oldEffect.cleanup();
    }
    effects[effectIndex] = {
      callback,
      deps,
      cleanup: callback(),
    };
  }

  currentHookIndex++;
}
