import { VEDS_ELEMENT } from './constants.js';

function isValidVedElement(obj) {
  return typeof obj === 'object' &&
    obj !== null &&
    obj.$$typeof === VEDS_ELEMENT;
}

function patchProps(el, oldProps, newProps) {
  console.log(oldProps, newProps);
  for (const key in oldProps) {
    if (!(key in newProps)) {
      el.removeAttribute(key);
    }
  }

  for (const key in newProps) {
    if (key === 'children') continue;
    const oldVal = oldProps[key];
    const newVal = newProps[key];
    if (oldVal !== newVal) {
      const attr = (key === 'className' || key === 'vedName') ? 'class' : key;
      el.setAttribute(attr, newVal);
    }
  }
} 

function patchChildren(parent, oldChildren, newChildren) {
  if (typeof newChildren === 'string' || typeof newChildren === 'number') {
    parent.textContent = newChildren;
    return;
  }

  if (!Array.isArray(oldChildren)) oldChildren = [];
  if (!Array.isArray(newChildren)) newChildren = [];

  const length = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < length; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (oldChild && newChild) {
      patch(oldChild, newChild, parent);
    } else if (newChild && !oldChild) {
      render(newChild, parent);
    } else if (oldChild && !newChild && oldChild.el) {
      parent.removeChild(oldChild.el);
    }
  }
}

export function patch(oldVNode, newVNode, container) {
  if (oldVNode == null) {
    render(newVNode, container);
  } else if (newVNode == null) {
    container.removeChild(oldVNode.el);
  } else if (oldVNode.type !== newVNode.type) {
    const newEl = render(newVNode, container);
    container.replaceChild(newEl, oldVNode.el);
  } else {
    const el = newVNode.el = oldVNode.el;
    if (!el) {
      console.error("Patch failed: el is null", { oldVNode, newVNode });
      return;
    }
    patchProps(el, oldVNode.props, newVNode.props);
    patchChildren(el, oldVNode.props.children, newVNode.props.children);
  }
}

export function render(vnode, container) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    const textNode = document.createTextNode(vnode);
    container.appendChild(textNode);
    return textNode;
  }

  if (!isValidVedElement(vnode)) {
    console.warn("Invalid VDOM node:", vnode);
    return;
  }

  const { type, props } = vnode;

  if (typeof type === 'function') {
    const componentVNode = type(props || {});
    const rendered = render(componentVNode, container);
    vnode.el = componentVNode.el;
    return rendered;
  }

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

  const children = props.children;

  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child != null && child !== false) render(child, dom);
    });
  } else if (children != null && children !== false) {
    render(children, dom);
  }

  container.appendChild(dom);
  return dom;
}
