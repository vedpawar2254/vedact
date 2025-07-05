import { patch } from "../core/patch.js";
import { effectStore } from "../shared/constants.js";
export var hookStateMap = new WeakMap();
export var currentComponent = null;
export var currentHookIndex = 0;
function areDepsEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
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
  var stateArray = hookStateMap.get(currentComponent);
  var index = currentHookIndex;
  if (stateArray[index] === undefined) {
    stateArray[index] = initialValue;
  }
  var setState = function setState(newValue) {
    var states = hookStateMap.get(currentComponent);
    if (states[index] !== newValue) {
      states[index] = newValue;
      var parent = currentComponent._container;
      var newVNode = currentComponent.type(currentComponent.props);
      newVNode._container = parent;
      patch(currentComponent._rendered, newVNode, parent);
      currentComponent._rendered = newVNode;
    }
  };
  currentHookIndex++;
  return [stateArray[index], setState];
}
export function useEffect(callback, deps) {
  var effectIndex = currentHookIndex;
  if (!effectStore.has(currentComponent)) {
    effectStore.set(currentComponent, []);
  }
  var effects = effectStore.get(currentComponent);
  var oldEffect = effects[effectIndex];
  var hasChanged = !oldEffect || !areDepsEqual(oldEffect.deps, deps);
  if (hasChanged) {
    if (oldEffect !== null && oldEffect !== void 0 && oldEffect.cleanup) {
      oldEffect.cleanup();
    }
    effects[effectIndex] = {
      callback: callback,
      deps: deps,
      cleanup: callback()
    };
  }
  currentHookIndex++;
}