import { VEDS_TEXT } from '../shared/constants.js';

export function createTextVNode(text) {
    return {
      $$typeof: VEDS_TEXT,
      type: null,
      text,
      props: null,
      el: null,
    };
}
  