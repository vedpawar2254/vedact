function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { VEDS_ELEMENT, VEDS_TEXT } from '../shared/constants.js';
import { prepareHooks } from '../hooks/hooks.js';
import { effectStore } from "../shared/constants.js";
function isValidVedElement(obj) {
  return _typeof(obj) === 'object' && obj !== null && (obj.$$typeof === VEDS_ELEMENT || obj.$$typeof === VEDS_TEXT);
}
function runEffects(component) {
  if (!effectStore.has(component)) return;
  var effects = effectStore.get(component);
  var _iterator = _createForOfIteratorHelper(effects),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var effect = _step.value;
      if (!effect) continue;
      if (effect.cleanup) {
        effect.cleanup();
      }
      effect.cleanup = effect.callback();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
export function patch(oldVNode, newVNode, container) {
  if (!oldVNode) {
    render(newVNode, container);
  } else if (!newVNode) {
    if (oldVNode.el) container.removeChild(oldVNode.el);
  } else if (oldVNode.$$typeof !== newVNode.$$typeof || oldVNode.type !== newVNode.type) {
    var newEl = render(newVNode, container);
    if (oldVNode.el) container.replaceChild(newEl, oldVNode.el);
  } else if (newVNode.$$typeof === VEDS_TEXT) {
    var el = newVNode.el = oldVNode.el;
    if (oldVNode.text !== newVNode.text) {
      el.nodeValue = newVNode.text;
    }
  } else {
    var _el = newVNode.el = oldVNode.el;
    var oldProps = oldVNode.props || {};
    var newProps = newVNode.props || {};
    patchProps(_el, oldProps, newProps);
    patchChildren(_el, oldProps.children, newProps.children);
  }
}
function patchChildren(parent, oldChildren, newChildren) {
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
function patchProps(el, oldProps, newProps) {
  var allProps = new Set([].concat(_toConsumableArray(Object.keys(oldProps || {})), _toConsumableArray(Object.keys(newProps || {}))));
  var _iterator2 = _createForOfIteratorHelper(allProps),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var key = _step2.value;
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
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
export function render(vnode, container) {
  if (!isValidVedElement(vnode)) {
    console.warn("Invalid VDOM node:", vnode);
    return;
  }
  if (vnode.$$typeof === VEDS_TEXT) {
    var textNode = document.createTextNode(vnode.text);
    vnode.el = textNode;
    container.appendChild(textNode);
    return textNode;
  }
  var type = vnode.type,
    props = vnode.props;
  if (typeof type === 'function') {
    prepareHooks(vnode);
    vnode._container = container;
    var childVNode = type(props || {});
    vnode._rendered = childVNode;
    var rendered = render(childVNode, container);
    vnode.el = childVNode.el;
    runEffects(vnode);
    return rendered;
  }
  // if (typeof type === 'function') {
  //   prepareHooks(vnode);
  //   currentHookIndex = 0; // Reset the hook index

  //   const childVNode = type(props || {});
  //   vnode._rendered = childVNode;
  //   const rendered = render(childVNode, container);

  //   // Run effects immediately after render
  //   if (effectStore.has(vnode)) {
  //     const effects = effectStore.get(vnode);
  //     effects.forEach(effect => {
  //       if (effect?.cleanup) effect.cleanup();
  //       effect.cleanup = callback();
  //     });
  //   }

  //   return rendered;
  // }

  var dom = document.createElement(type);
  vnode.el = dom;
  for (var prop in props) {
    if (prop === 'children') continue;
    var val = props[prop];
    if ((prop.startsWith('on') || prop.startsWith('onveds')) && typeof val === 'function') {
      var eventName = prop.toLowerCase().replace(/^onveds|^on/, '');
      dom.addEventListener(eventName, val);
    } else {
      var attr = prop === 'className' || prop === 'vedName' ? 'class' : prop;
      dom.setAttribute(attr, val);
    }
  }
  var children = props.children || [];
  children.forEach(function (child) {
    if (child != null && child !== false) {
      var _rendered = render(child, dom);
      if (_typeof(child) === 'object') child.el = _rendered;
    }
  });
  container.appendChild(dom);
  console.log('Rendering', {
    vnode: vnode
  });
  return dom;
}