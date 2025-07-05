function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import { VEDS_TEXT } from '../shared/constants.js';
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
    var _el = newVNode.el = oldVNode.el;
    if (oldVNode.text !== newVNode.text) {
      console.log("Updating text from \"".concat(oldVNode.text, "\" to \"").concat(newVNode.text, "\""));
      _el.nodeValue = newVNode.text;
    }
    return;
  }
  if (oldVNode.$$typeof !== newVNode.$$typeof || oldVNode.type !== newVNode.type) {
    console.log('→ Replacing due to different types');
    var newEl = render(newVNode, container);
    if (oldVNode.el) container.replaceChild(newEl, oldVNode.el);
    return;
  }
  console.log('→ Patching element node');
  var el = newVNode.el = oldVNode.el;
  var oldProps = oldVNode.props || {};
  var newProps = newVNode.props || {};
  patchProps(el, oldProps, newProps);
  patchChildren(el, oldProps.children, newProps.children);
}
export function patchChildren(parent, oldChildren, newChildren) {
  oldChildren = Array.isArray(oldChildren) ? oldChildren : oldChildren ? [oldChildren] : [];
  newChildren = Array.isArray(newChildren) ? newChildren : newChildren ? [newChildren] : [];
  var maxLength = Math.max(oldChildren.length, newChildren.length);
  for (var i = 0; i < maxLength; i++) {
    var oldChild = oldChildren[i];
    var newChild = newChildren[i];
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
  var allProps = new Set([].concat(_toConsumableArray(Object.keys(oldProps || {})), _toConsumableArray(Object.keys(newProps || {}))));
  var _iterator = _createForOfIteratorHelper(allProps),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      if (key === 'children') continue;
      var oldVal = oldProps === null || oldProps === void 0 ? void 0 : oldProps[key];
      var newVal = newProps === null || newProps === void 0 ? void 0 : newProps[key];
      if (oldVal !== newVal) {
        if (key.startsWith('on') && typeof newVal === 'function') {
          var eventName = key.toLowerCase().substring(2);
          if (oldVal) el.removeEventListener(eventName, oldVal);
          el.addEventListener(eventName, newVal);
        } else if (newVal == null || newVal === false) {
          el.removeAttribute(key);
        } else {
          var attr = key === 'className' ? 'class' : key;
          el.setAttribute(attr, newVal);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}