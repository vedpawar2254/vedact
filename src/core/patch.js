import {  VEDS_TEXT } from '../shared/constants.js';
import { render } from './renderer.js';

export function patch(oldVNode, newVNode, container) {

  console.log('oldVNode', oldVNode);
console.log('newVNode', newVNode);
console.log('type equal?', oldVNode.type === newVNode.type);
console.log('typeof equal?', oldVNode.$$typeof === newVNode.$$typeof);
  if (!oldVNode) {
    console.log('→ Mounting new node');
    render(newVNode, container);
    return;
  }

  if (!newVNode) {
    console.log('→ Removing old node');
    if (oldVNode.el) container.removeChild(oldVNode.el);
    return;
  }

  if (oldVNode.$$typeof === VEDS_TEXT && newVNode.$$typeof === VEDS_TEXT) {
    console.log('→ Diffing text node');
    const el = newVNode.el = oldVNode.el;
    if (oldVNode.text !== newVNode.text) {
      console.log(`Updating text from "${oldVNode.text}" to "${newVNode.text}"`);
      el.nodeValue = newVNode.text;
    }
    return;
  }

  if (oldVNode.$$typeof !== newVNode.$$typeof || oldVNode.type !== newVNode.type) {
    console.log('→ Replacing due to different types');
    const newEl = render(newVNode, container);
    if (oldVNode.el) container.replaceChild(newEl, oldVNode.el);
    return;
  }

  console.log('→ Patching element node');
  const el = newVNode.el = oldVNode.el;
  const oldProps = oldVNode.props || {};
  const newProps = newVNode.props || {};
  patchProps(el, oldProps, newProps);
  patchChildren(el, oldProps.children, newProps.children);
}


  
export function patchChildren(parent, oldChildren, newChildren) {
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
  
export function patchProps(el, oldProps, newProps) {
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
  
  