import { VEDS_ELEMENT } from './constants.js';
import { createTextVNode } from './createTextVNode.js';

export default function createElement(type, config, ...children) {
  const props = {};
  let key = null;
  let ref = null;

  if (config != null) {
    if (config.ref !== undefined) ref = config.ref;
    if (config.key !== undefined) key = '' + config.key;

    for (const propName in config) {
      if (propName !== 'key' && propName !== 'ref') {
        props[propName] = config[propName];
      }
    }
  }

  props.children = children.flat().filter(child => 
    child != null && child !== false && child !== ''
  ).map(child => 
    typeof child === 'object' ? child : createTextVNode(child)
  );

  return {
    $$typeof: VEDS_ELEMENT,
    type,
    key,
    ref,
    props,
    _owner: null,
    el: null
  };
}