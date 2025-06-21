import { VEDS_ELEMENT } from './constants.js';
function isValidVedElement(obj) {
    return typeof obj === 'object' &&
           obj !== null &&
           obj.$$typeof === VEDS_ELEMENT;
}

export function render(vnode, container) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      const textNode = document.createTextNode(vnode);
      container.appendChild(textNode);
      return;
    }


    if (!isValidVedElement(vnode) && typeof vnode !== 'string' && typeof vnode !== 'number') {
        console.warn("Invalid VDOM node:", vnode);
        return;
      }

    
  
    const { type, props } = vnode;
  

    if (typeof type === 'function') {
      const componentVNode = type(props || {});
      render(componentVNode, container);
      return;
    }
  
    
    const dom = document.createElement(type);
  
    
    for (const prop in props) {
      if (prop === 'children') continue;
  
      const val = props[prop];
  
      
      if ((prop.startsWith("on") || prop.startsWith("onveds")) && typeof val === "function") {
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
  }
  