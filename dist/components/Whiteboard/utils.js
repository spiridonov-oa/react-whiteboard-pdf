"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = exports.isString = exports.isNumber = void 0;
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
exports.throttle = throttle;
const isNumber = value => {
  return typeof value === 'number' && !isNaN(value);
};
exports.isNumber = isNumber;
const isString = value => {
  return typeof value === 'string';
};
exports.isString = isString;