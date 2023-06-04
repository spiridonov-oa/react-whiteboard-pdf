"use strict";

exports.__esModule = true;
exports.WhiteBoardS = exports.ToolbarS = exports.ToolbarItemS = exports.ToolbarHolderS = exports.SeparatorS = exports.RangeInputS = exports.PDFWrapperS = exports.ButtonS = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var color = '#ddd';

var WhiteBoardS = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  font-family: Arial, Helvetica, sans-serif;\n  position: relative;\n  flex: 1;\n  width: 100%;\n  height: 100%;\n  min-width: 100%;\n  min-height: 100%;\n"])));

exports.WhiteBoardS = WhiteBoardS;

var ButtonS = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0 2px;\n  min-width: 40px;\n  min-height: 40px;\n  border-radius: 5px;\n  color: #333;\n  border: none;\n  background-color: transparent;\n  outline: none;\n  cursor: pointer;\n\n  img {\n    width: 18px;\n    height: 18px;\n    vertical-align: middle;\n  }\n\n  &:hover {\n    background-color: ", ";\n  }\n\n  &.selected {\n    background-color: ", ";\n  }\n"])), color, color);

exports.ButtonS = ButtonS;

var ToolbarItemS = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteralLoose(["\n  margin: 0 2px;\n"])));

exports.ToolbarItemS = ToolbarItemS;

var SeparatorS = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteralLoose(["\n  margin: 0 4px;\n  width: 1px;\n  height: 30px;\n  background: #cbcbcb;\n"])));

exports.SeparatorS = SeparatorS;

var ToolbarS = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteralLoose(["\n  margin-top: -8px;\n  padding: 12px 8px 4px;\n  border-radius: 5px;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  background: white;\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);\n  z-index: 1;\n"])));

exports.ToolbarS = ToolbarS;

var ToolbarHolderS = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteralLoose(["\n  position: absolute;\n  top: 0;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])));

exports.ToolbarHolderS = ToolbarHolderS;

var PDFWrapperS = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteralLoose(["\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n"])));

exports.PDFWrapperS = PDFWrapperS;

var RangeInputS = _styledComponents.default.input(_templateObject8 || (_templateObject8 = _taggedTemplateLiteralLoose(["\n  & {\n    height: 25px;\n    -webkit-appearance: none;\n    margin: 10px 0;\n    width: 100px;\n  }\n  &:focus {\n    outline: none;\n  }\n  &::-webkit-slider-runnable-track {\n    position: relative;\n    width: 100%;\n    height: 4px;\n    cursor: pointer;\n    animate: 0.2s;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n    // box-shadow: 0 1px 4px rgb(0 0 0 / 0.5);\n  }\n  &::-webkit-slider-thumb {\n    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);\n    border: 1px solid #fff;\n    border-radius: 45px;\n    height: ", "px;\n    width: ", "px;\n    background: ", ";\n    cursor: pointer;\n    margin-top: ", "px;\n    -webkit-appearance: none;\n  }\n  &:focus::-webkit-slider-runnable-track {\n    background: transparent;\n  }\n\n  &::-moz-range-track {\n    width: 100%;\n    height: 5px;\n    cursor: pointer;\n    animate: 0.2s;\n\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n  }\n  &::-moz-range-thumb {\n    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);\n    border: 1px solid #fff;\n    border-radius: 45px;\n    height: ", "px;\n    width: ", "px;\n    background: ", ";\n    cursor: pointer;\n    margin-top: ", "px;\n  }\n\n  &::-ms-track {\n    width: 100%;\n    height: 5px;\n    cursor: pointer;\n    animate: 0.2s;\n    background: transparent;\n    border-color: transparent;\n    color: transparent;\n  }\n  &::-ms-fill-lower {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n  }\n  &::-ms-fill-upper {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n  }\n  &::-ms-thumb {\n    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);\n    border: 1px solid #fff;\n    border-radius: 45px;\n    height: ", "px;\n    width: ", "px;\n    background: ", ";\n    cursor: pointer;\n    margin-top: ", "px;\n  }\n  &:focus::-ms-fill-lower {\n    background: transparent;\n  }\n  &:focus::-ms-fill-upper {\n    background: transparent;\n  }\n"])), function (_ref) {
  var value = _ref.value;
  return value + 2 || 20;
}, function (_ref2) {
  var value = _ref2.value;
  return value + 2 || 20;
}, function (_ref3) {
  var thumbColor = _ref3.thumbColor;
  return thumbColor || '#232323';
}, function (_ref4) {
  var value = _ref4.value;
  return -value / 2 || -8;
}, function (_ref5) {
  var value = _ref5.value;
  return value + 2 || 20;
}, function (_ref6) {
  var value = _ref6.value;
  return value + 2 || 20;
}, function (_ref7) {
  var thumbColor = _ref7.thumbColor;
  return thumbColor || '#232323';
}, function (_ref8) {
  var value = _ref8.value;
  return -value / 2 || -8;
}, function (_ref9) {
  var value = _ref9.value;
  return value + 2 || 20;
}, function (_ref10) {
  var value = _ref10.value;
  return value + 2 || 20;
}, function (_ref11) {
  var thumbColor = _ref11.thumbColor;
  return thumbColor || '#232323';
}, function (_ref12) {
  var value = _ref12.value;
  return -value / 2 || -8;
});

exports.RangeInputS = RangeInputS;