import { VEDS_ELEMENT } from './constants.js';
export default function createElement(type, config, ...children) {
  
  let propName;
  let props = {};
  let key = null;
  let ref = null;

  if (config != null) {
    if (config.ref !== undefined) {
      ref = config.ref;
    }
    if (config.key !== undefined) {
      key = '' + config.key;
    }
    

   
    for (propName in config) {
      if (propName !== 'key' && propName !== 'ref' && Object.hasOwnProperty.call(config, propName)) {
        props[propName] = config[propName];
      }
    }
  }

  
  if (children.length === 1) {
    props.children = children[0];
  } else if (children.length > 1) {
    props.children = children;
  }

  
  return {
    $$typeof: VEDS_ELEMENT,
    type: type,
    key: key,
    ref: ref,
    props: props,
    ved: "sup bruv",
    _owner: null,
  };
}