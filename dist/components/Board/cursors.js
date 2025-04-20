"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCursor = exports.cursors = void 0;
var _eraser = _interopRequireDefault(require("./../images/eraser.svg"));
var _pencil = _interopRequireDefault(require("./../images/pencil.svg"));
const cursors = exports.cursors = {
  eraser: `url(${_eraser.default}) 0 30, auto`,
  pencil: `url(${_pencil.default}) 0 80, auto`
};
const getCursor = type => {
  return cursors[type];
};
exports.getCursor = getCursor;