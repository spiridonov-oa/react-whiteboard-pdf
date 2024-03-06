"use strict";

exports.__esModule = true;
exports.ColorPickerS = exports.ColorLabelS = void 0;
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject, _templateObject2;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }
const ColorPickerS = exports.ColorPickerS = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border: 1px solid #999;\n  border-radius: ", "px;\n  height: ", "px;\n  width: ", "px;\n  cursor: pointer;\n\n  > div {\n    //box-shadow: 1px 1px 3px rgb(0 0 0 / 0.6);\n  }\n\n  &:hover {\n    background-color: #eee;\n  }\n"])), _ref => {
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
const ColorLabelS = exports.ColorLabelS = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteralLoose(["\n  border-radius: ", "px;\n  height: ", "px;\n  width: ", "px;\n  background: ", ";\n"])), _ref4 => {
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