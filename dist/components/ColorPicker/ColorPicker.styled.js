"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HiddenColorInputS = exports.ColorPickerS = exports.ColorLabelS = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject, _templateObject2, _templateObject3;
const ColorPickerS = exports.ColorPickerS = _styledComponents.default.div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border: 1px solid #999;\n  border-radius: ", "px;\n  height: ", "px;\n  width: ", "px;\n  cursor: pointer;\n\n  > div {\n    //box-shadow: 1px 1px 3px rgb(0 0 0 / 0.6);\n  }\n\n  &:hover {\n    background-color: #eee;\n  }\n"])), _ref => {
  let {
    size
  } = _ref;
  return size || 34;
}, _ref2 => {
  let {
    size
  } = _ref2;
  return size || 34;
}, _ref3 => {
  let {
    size
  } = _ref3;
  return size || 34;
});
const ColorLabelS = exports.ColorLabelS = _styledComponents.default.div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  border-radius: ", "px;\n  height: ", "px;\n  width: ", "px;\n  background: ", ";\n"])), _ref4 => {
  let {
    size
  } = _ref4;
  return size - 4 || 28;
}, _ref5 => {
  let {
    size
  } = _ref5;
  return size - 4 || 28;
}, _ref6 => {
  let {
    size
  } = _ref6;
  return size - 4 || 28;
}, _ref7 => {
  let {
    color
  } = _ref7;
  return color || '#000';
});
const HiddenColorInputS = exports.HiddenColorInputS = _styledComponents.default.input(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  opacity: 0;\n  position: absolute;\n  bottom: -1px;\n  width: 1px;\n  height: 1px;\n  border: none;\n  padding: 0;\n  margin: 0;\n  background: transparent;\n"])));