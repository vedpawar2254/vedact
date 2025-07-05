function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { VEDS_ELEMENT } from '../shared/constants.js';
import { createTextVNode } from './createTextVNode.js';
export default function createElement(type, config) {
  var props = {};
  var key = null;
  var ref = null;
  if (config != null) {
    if (config.ref !== undefined) ref = config.ref;
    if (config.key !== undefined) key = '' + config.key;
    for (var propName in config) {
      if (propName !== 'key' && propName !== 'ref') {
        props[propName] = config[propName];
      }
    }
  }
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }
  props.children = children.flat().filter(function (child) {
    return child != null && child !== false && child !== '';
  }).map(function (child) {
    return _typeof(child) === 'object' ? child : createTextVNode(child);
  });
  return {
    $$typeof: VEDS_ELEMENT,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: null,
    el: null
  };
}