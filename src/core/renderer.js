import { VEDS_ELEMENT, VEDS_TEXT } from '../shared/constants.js';
import { prepareHooks } from '../hooks/index.js';
import {effectStore} from "../shared/constants.js"


function isValidVedElement(obj) {
  return typeof obj === 'object' &&
    obj !== null &&
    (obj.$$typeof === VEDS_ELEMENT || obj.$$typeof === VEDS_TEXT);
}


function runEffects(component) {
  if (!effectStore.has(component)) return;
  
  const effects = effectStore.get(component);
  for (const effect of effects) {
    if (!effect) continue;
    if (effect.cleanup) {
      effect.cleanup();
    }
    effect.cleanup = effect.callback();
  }
}


export function render(vnode, container) {
  if (!isValidVedElement(vnode)) {
    console.warn("Invalid VDOM node:", vnode);
    return;
  }

  if (vnode.$$typeof === VEDS_TEXT) {
    const textNode = document.createTextNode(vnode.text);
    vnode.el = textNode;
    container.appendChild(textNode);
    return textNode;
  }

  const { type, props } = vnode;

  if (typeof type === 'function') {
    prepareHooks(vnode);
    vnode._container = container;

    const childVNode = type(props || {});
    vnode._rendered = childVNode;

    const tempFragment = document.createDocumentFragment();
    const rendered = render(childVNode, tempFragment);

    vnode.el = childVNode.el;
    runEffects(vnode);

    if (!vnode._containerAppended) {
      container.appendChild(vnode.el);
      vnode._containerAppended = true; 
    }

    console.log("Appending to container:", container);
    console.log("Element:", vnode.el);
    return vnode.el;
  }
  // if (typeof type === 'function') {
  //   prepareHooks(vnode);
  //   currentHookIndex = 0; // Reset the hook index
    
  //   const childVNode = type(props || {});
  //   vnode._rendered = childVNode;
  //   const rendered = render(childVNode, container);
    
  //   // Run effects immediately after render
  //   if (effectStore.has(vnode)) {
  //     const effects = effectStore.get(vnode);
  //     effects.forEach(effect => {
  //       if (effect?.cleanup) effect.cleanup();
  //       effect.cleanup = callback();
  //     });
  //   }
    
  //   return rendered;
  // }

  const dom = document.createElement(type);
  vnode.el = dom;

  for (const prop in props) {
    if (prop === 'children') continue;
    const val = props[prop];

    if ((prop.startsWith('on') || prop.startsWith('onveds')) && typeof val === 'function') {
      const eventName = prop.toLowerCase().replace(/^onveds|^on/, '');
      dom.addEventListener(eventName, val);
    } else {
      const attr = (prop === 'className' || prop === 'vedName') ? 'class' : prop;
      dom.setAttribute(attr, val);
    }
  }

  const children = props.children || [];
  children.forEach(child => {
    if (child != null && child !== false) {
      const rendered = render(child, dom);
      if (typeof child === 'object') child.el = rendered;
    }
  });

  container.appendChild(dom);
  console.log('Rendering', { vnode });
  return dom;
}
