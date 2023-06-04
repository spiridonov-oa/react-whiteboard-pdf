"use strict";

exports.__esModule = true;
exports.ColorPickerS = exports.ColorLabelS = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject, _templateObject2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var ColorPickerS = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border: 1px solid #999;\n  border-radius: 5px;\n  height: ", "px;\n  width: ", "px;\n  cursor: pointer;\n\n  > div {\n    //box-shadow: 1px 1px 3px rgb(0 0 0 / 0.6);\n  }\n\n  &:hover {\n    background-color: #eee;\n  }\n"])), function (_ref) {
  var size = _ref.size;
  return size || 34;
}, function (_ref2) {
  var size = _ref2.size;
  return size || 34;
});

exports.ColorPickerS = ColorPickerS;

var ColorLabelS = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteralLoose(["\n  border-radius: 3px;\n  height: ", "px;\n  width: ", "px;\n  background: ", ";\n"])), function (_ref3) {
  var size = _ref3.size;
  return size - 4 || 28;
}, function (_ref4) {
  var size = _ref4.size;
  return size - 4 || 28;
}, function (_ref5) {
  var color = _ref5.color;
  return color || '#000';
});

exports.ColorLabelS = ColorLabelS;