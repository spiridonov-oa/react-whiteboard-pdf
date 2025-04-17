"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorPickerS = exports.ColorLabelS = void 0;
var _styledComponents = _interopRequireDefault(require("styled-components"));
const ColorPickerS = exports.ColorPickerS = _styledComponents.default.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #999;
  border-radius: ${_ref => {
  let {
    size
  } = _ref;
  return size || 34;
}}px;
  height: ${_ref2 => {
  let {
    size
  } = _ref2;
  return size || 34;
}}px;
  width: ${_ref3 => {
  let {
    size
  } = _ref3;
  return size || 34;
}}px;
  cursor: pointer;

  > div {
    //box-shadow: 1px 1px 3px rgb(0 0 0 / 0.6);
  }

  &:hover {
    background-color: #eee;
  }
`;
const ColorLabelS = exports.ColorLabelS = _styledComponents.default.div`
  border-radius: ${_ref4 => {
  let {
    size
  } = _ref4;
  return size - 4 || 28;
}}px;
  height: ${_ref5 => {
  let {
    size
  } = _ref5;
  return size - 4 || 28;
}}px;
  width: ${_ref6 => {
  let {
    size
  } = _ref6;
  return size - 4 || 28;
}}px;
  background: ${_ref7 => {
  let {
    color
  } = _ref7;
  return color || '#000';
}};
`;