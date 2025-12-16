"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZoomBarS = exports.WrapperS = exports.WhiteBoardS = exports.ToolbarS = exports.ToolbarItemS = exports.ToolbarHolderS = exports.TabsS = exports.TabS = exports.SmallTextS = exports.SeparatorS = exports.RangeInputS = exports.PDFWrapperS = exports.IconImgS = exports.CoreWrapperS = exports.ColorButtonS = exports.ColorBarS = exports.CloseBtnS = exports.CanvasS = exports.ButtonS = exports.BoardWrapperS = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _theme = _interopRequireDefault(require("./theme"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20;
const color = _theme.default.color;
const WrapperS = exports.WrapperS = _styledComponents.default.div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  font-family: inherit;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  min-width: 100%;\n  min-height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  background: white;\n  overflow: hidden;\n"])));
const TabsS = exports.TabsS = _styledComponents.default.div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n"])));
const TabS = exports.TabS = _styledComponents.default.div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  line-height: 1em;\n  padding: 1em 1em;\n  padding-right: 2em;\n  border-right: 1px solid rgba(0, 0, 0, 0.1);\n  max-width: 200px;\n  background: ", ";\n  box-shadow: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: pointer;\n\n  ", "\n"])), _ref => {
  let {
    active
  } = _ref;
  return active ? '#fff' : 'rgba(0, 0, 0, 0.1)';
}, _ref2 => {
  let {
    active
  } = _ref2;
  return active ? 'none' : 'inset 0px -2px 2px -4px rgba(0, 0, 0, 0.2)';
}, _ref3 => {
  let {
    isAdd
  } = _ref3;
  return isAdd && "\n    background-color: #fff;\n    font-size: 30px;\n    line-height: 6px;\n    padding: 0em;\n    width: 50px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    box-shadow: none;\n    min-height: 40px;\n  ";
});
const WhiteBoardS = exports.WhiteBoardS = _styledComponents.default.div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  font-family: Arial, Helvetica, sans-serif;\n  position: relative;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  overflow: hidden;\n"])));
const BoardWrapperS = exports.BoardWrapperS = _styledComponents.default.div(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n"])));
const ButtonS = exports.ButtonS = _styledComponents.default.button(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0 2px;\n  padding: 0;\n  min-width: 40px;\n  min-height: 40px;\n  border-radius: 5px;\n  color: #333;\n  border: none;\n  background-color: transparent;\n  outline: none;\n  cursor: pointer;\n  transition: background-color 0.3s;\n\n  img {\n    width: 18px;\n    height: 18px;\n    vertical-align: middle;\n  }\n\n  &:hover {\n    background-color: ", ";\n  }\n\n  &.selected {\n    background-color: ", ";\n  }\n"])), color, color);
const IconImgS = exports.IconImgS = _styledComponents.default.img(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  width: ", ";\n  height: ", ";\n  vertical-align: middle;\n"])), _ref4 => {
  let {
    size
  } = _ref4;
  return size ? "".concat(size, "px") : '22px';
}, _ref5 => {
  let {
    size
  } = _ref5;
  return size ? "".concat(size, "px") : '22px';
});
const SmallTextS = exports.SmallTextS = _styledComponents.default.span(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  font-size: 11px;\n"])));
const CanvasS = exports.CanvasS = _styledComponents.default.canvas(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: transparent;\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  overflow: hidden;\n"])));
const CloseBtnS = exports.CloseBtnS = _styledComponents.default.span(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  top: 50%;\n  right: 1px;\n  transform: translateY(-50%);\n  font-size: 14px;\n  font-weight: bold;\n  font-family: Arial, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 26px;\n  height: 100%;\n  line-height: 12px;\n  margin-left: 5px;\n  cursor: pointer;\n  color: #333;\n"])));
const CoreWrapperS = exports.CoreWrapperS = _styledComponents.default.div(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2.default)(["\n  display: ", ";\n"])), _ref6 => {
  let {
    visible
  } = _ref6;
  return visible ? 'flex' : 'none';
});
const ToolbarItemS = exports.ToolbarItemS = _styledComponents.default.div(_templateObject12 || (_templateObject12 = (0, _taggedTemplateLiteral2.default)(["\n  margin: 0 2px;\n"])));
const SeparatorS = exports.SeparatorS = _styledComponents.default.div(_templateObject13 || (_templateObject13 = (0, _taggedTemplateLiteral2.default)(["\n  margin: 0 4px;\n  width: 1px;\n  height: 30px;\n  background: #cbcbcb;\n"])));
const ToolbarS = exports.ToolbarS = _styledComponents.default.div(_templateObject14 || (_templateObject14 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 4px 4px;\n  border-radius: 5px;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  background: white;\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);\n  z-index: 2;\n"])));
const ColorBarS = exports.ColorBarS = _styledComponents.default.div(_templateObject15 || (_templateObject15 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  top: 100px;\n  left: 50px;\n  transform: rotate(90deg);\n  transform-origin: 0% 0%;\n  padding: 0 0 0 4px;\n  border-radius: 5px;\n  display: flex;\n  font-size: 12px;\n  flex-wrap: wrap;\n  flex-direction: row;\n  align-items: center;\n  background: white;\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);\n  z-index: 2;\n\n  > button {\n    transform: rotate(-90deg);\n  }\n"])));
const ZoomBarS = exports.ZoomBarS = _styledComponents.default.div(_templateObject16 || (_templateObject16 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  top: 100px;\n  right: 0;\n  padding: 4px 0;\n  border-radius: 5px;\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: column;\n  align-items: center;\n  background: white;\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);\n  z-index: 2;\n"])));
const ToolbarHolderS = exports.ToolbarHolderS = _styledComponents.default.div(_templateObject17 || (_templateObject17 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  top: 0;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])));
const PDFWrapperS = exports.PDFWrapperS = _styledComponents.default.div(_templateObject18 || (_templateObject18 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n"])));
const ColorButtonS = exports.ColorButtonS = _styledComponents.default.button(_templateObject19 || (_templateObject19 = (0, _taggedTemplateLiteral2.default)(["\n  z-index: 2;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0 2px;\n  min-width: 24px;\n  min-height: 24px;\n  border-radius: 5px;\n  border: none;\n  background-color: ", ";\n  outline: none;\n  cursor: pointer;\n"])), _ref7 => {
  let {
    color
  } = _ref7;
  return color;
});
const RangeInputS = exports.RangeInputS = _styledComponents.default.input(_templateObject20 || (_templateObject20 = (0, _taggedTemplateLiteral2.default)(["\n  & {\n    margin: 10px 0;\n    transform: rotate(180deg);\n    width: 100px;\n    height: 25px; /* Adjust height to control the width of the slider */\n    -webkit-appearance: none;\n  }\n  &:focus {\n    outline: none;\n  }\n  &::-webkit-slider-runnable-track {\n    position: relative;\n    width: 100%;\n    height: 4px;\n    cursor: pointer;\n    animate: 0.2s;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n    // box-shadow: 0 1px 4px rgb(0 0 0 / 0.5);\n  }\n  &::-webkit-slider-thumb {\n    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);\n    border: 1px solid #fff;\n    border-radius: 45px;\n    height: ", "px;\n    width: ", "px;\n    background: ", ";\n    cursor: pointer;\n    margin-top: ", "px;\n    -webkit-appearance: none;\n  }\n  &:focus::-webkit-slider-runnable-track {\n    background: transparent;\n  }\n\n  &::-moz-range-track {\n    width: 100%;\n    height: 5px;\n    cursor: pointer;\n    animate: 0.2s;\n\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n  }\n  &::-moz-range-thumb {\n    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);\n    border: 1px solid #fff;\n    border-radius: 45px;\n    height: ", "px;\n    width: ", "px;\n    background: ", ";\n    cursor: pointer;\n    margin-top: ", "px;\n  }\n\n  &::-ms-track {\n    width: 100%;\n    height: 5px;\n    cursor: pointer;\n    animate: 0.2s;\n    background: transparent;\n    border-color: transparent;\n    color: transparent;\n  }\n  &::-ms-fill-lower {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n  }\n  &::-ms-fill-upper {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 5px;\n    border: 1px solid #555;\n  }\n  &::-ms-thumb {\n    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);\n    border: 1px solid #fff;\n    border-radius: 45px;\n    height: ", "px;\n    width: ", "px;\n    background: ", ";\n    cursor: pointer;\n    margin-top: ", "px;\n  }\n  &:focus::-ms-fill-lower {\n    background: transparent;\n  }\n  &:focus::-ms-fill-upper {\n    background: transparent;\n  }\n"])), _ref8 => {
  let {
    value
  } = _ref8;
  return (Number(value) || 18) + 2;
}, _ref9 => {
  let {
    value
  } = _ref9;
  return (Number(value) || 18) + 2;
}, _ref10 => {
  let {
    thumbcolor
  } = _ref10;
  return thumbcolor || '#232323';
}, _ref11 => {
  let {
    value
  } = _ref11;
  return -value / 2 || -8;
}, _ref12 => {
  let {
    value
  } = _ref12;
  return value + 2 || 20;
}, _ref13 => {
  let {
    value
  } = _ref13;
  return value + 2 || 20;
}, _ref14 => {
  let {
    thumbcolor
  } = _ref14;
  return thumbcolor || '#232323';
}, _ref15 => {
  let {
    value
  } = _ref15;
  return -value / 2 || -8;
}, _ref16 => {
  let {
    value
  } = _ref16;
  return value + 2 || 20;
}, _ref17 => {
  let {
    value
  } = _ref17;
  return value + 2 || 20;
}, _ref18 => {
  let {
    thumbcolor
  } = _ref18;
  return thumbcolor || '#232323';
}, _ref19 => {
  let {
    value
  } = _ref19;
  return -value / 2 || -8;
});