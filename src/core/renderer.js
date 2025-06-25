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

export function patch(oldVNode, newVNode, container) {
  if (!oldVNode) {
    render(newVNode, container);
  } else if (!newVNode) {
    if (oldVNode.el) container.removeChild(oldVNode.el);
  } else if (oldVNode.$$typeof !== newVNode.$$typeof || oldVNode.type !== newVNode.type) {
    const newEl = render(newVNode, container);
    if (oldVNode.el) container.replaceChild(newEl, oldVNode.el);
  } else if (newVNode.$$typeof === VEDS_TEXT) {
    const el = newVNode.el = oldVNode.el;
    if (oldVNode.text !== newVNode.text) {
      el.nodeValue = newVNode.text;
    }
  } else {
    const el = newVNode.el = oldVNode.el;
    const oldProps = oldVNode.props || {};
    const newProps = newVNode.props || {};
    patchProps(el, oldProps, newProps);
    patchChildren(el, oldProps.children, newProps.children);
  }
}

function patchChildren(parent, oldChildren, newChildren) {
  oldChildren = Array.isArray(oldChildren) ? oldChildren : (oldChildren ? [oldChildren] : []);
  newChildren = Array.isArray(newChildren) ? newChildren : (newChildren ? [newChildren] : []);

  const maxLength = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (oldChild && newChild) {
      patch(oldChild, newChild, parent);
    } else if (newChild) {
      render(newChild, parent);
    } else if (oldChild && oldChild.el) {
      parent.removeChild(oldChild.el);
    }
  }
}

function patchProps(el, oldProps, newProps) {
  const allProps = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);
  
  for (const key of allProps) {
    if (key === 'children') continue;
    
    const oldVal = oldProps?.[key];
    const newVal = newProps?.[key];
    
    if (oldVal !== newVal) {
      if (key.startsWith('on') && typeof newVal === 'function') {
        const eventName = key.toLowerCase().substring(2);
        if (oldVal) el.removeEventListener(eventName, oldVal);
        el.addEventListener(eventName, newVal);
      } else if (newVal == null || newVal === false) {
        el.removeAttribute(key);
      } else {
        const attr = key === 'className' ? 'class' : key;
        el.setAttribute(attr, newVal);
      }
    }
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
    const rendered = render(childVNode, container);
    vnode.el = childVNode.el;
    runEffects(vnode);
    return rendered;
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
