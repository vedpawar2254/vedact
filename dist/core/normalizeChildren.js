function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { createTextVNode } from './createTextVNode.js';
export function normalizeChildren(children) {
  return children.map(function (child) {
    if (Array.isArray(child)) {
      return normalizeChildren(child);
    } else if (_typeof(child) === 'object') {
      var _child$props;
      if (child !== null && child !== void 0 && (_child$props = child.props) !== null && _child$props !== void 0 && _child$props.children) {
        child.props.children = normalizeChildren(Array.isArray(child.props.children) ? child.props.children : [child.props.children]);
      }
      return child;
    } else {
      return createTextVNode(child);
    }
  }).flat();
}