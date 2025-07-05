function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { VEDS_ELEMENT, VEDS_TEXT } from '../shared/constants.js';
import { prepareHooks } from '../hooks/index.js';
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
    var tempFragment = document.createDocumentFragment();
    var rendered = render(childVNode, tempFragment);
    vnode.el = childVNode.el;
    runEffects(vnode);
    if (!vnode._containerAppended) {
      container.appendChild(vnode.el);
      vnode._containerAppended = true;
    }
    console.log("Appending to container:", container);
    console.log("Element:", vnode.el);
    return vnode.el;
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