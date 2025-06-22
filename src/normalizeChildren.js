import { createTextVNode } from './createTextVNode.js';

export function normalizeChildren(children) {
  return children.map(child => {
    if (Array.isArray(child)) {
      return normalizeChildren(child);
    } else if (typeof child === 'object') {
      if (child?.props?.children) {
        child.props.children = normalizeChildren(
          Array.isArray(child.props.children)
            ? child.props.children
            : [child.props.children]
        );
      }
      return child;
    } else {
      return createTextVNode(child);
    }
  }).flat();
}