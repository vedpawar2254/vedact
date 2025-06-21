export function render(vnode, container){

    if (typeof type === 'function') {
        const componentVNode = type(props);
        render(componentVNode, container);
        return;
      }

    if (typeof vnode === 'string' || typeof vnode === 'number') {
        const textNode = document.createTextNode(vnode);
        container.appendChild(textNode);
        return;
    }

    const { type, props } = vnode;

    const dom = document.createElement(type);

    for (const prop in props) {
        if (prop === "children") continue;
      
        if (prop.startsWith("onveds") && typeof props[prop] === "function") {
          const event = prop.toLowerCase().slice(6); 
          dom.addEventListener(event, props[prop]);
        } else {
          const attr = prop === "vedName" ? "class" : prop;
          dom.setAttribute(attr, props[prop]);
        }
      }

    const children = props.children;

    if (Array.isArray(children)) {
        children.forEach(child => render(child, dom));
    } else if (children != null) {
        render(children, dom);
    }

  
    container.appendChild(dom);

}