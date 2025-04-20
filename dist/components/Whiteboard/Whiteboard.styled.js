"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZoomBarS = exports.WrapperS = exports.WhiteBoardS = exports.ToolbarS = exports.ToolbarItemS = exports.ToolbarHolderS = exports.TabsS = exports.TabS = exports.SeparatorS = exports.RangeInputS = exports.PDFWrapperS = exports.ColorButtonS = exports.ColorBarS = exports.ButtonS = void 0;
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _theme = _interopRequireDefault(require("./theme"));
const color = _theme.default.color;
const WrapperS = exports.WrapperS = _styledComponents.default.div`
  font-family: inherit;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;
`;
const TabsS = exports.TabsS = _styledComponents.default.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;
const TabS = exports.TabS = _styledComponents.default.div`
  position: relative;
  line-height: 1em;
  padding: 1em 1em;
  padding-right: 2em;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  max-width: 200px;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0px -2px 2px -4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;
const WhiteBoardS = exports.WhiteBoardS = _styledComponents.default.div`
  font-family: Arial, Helvetica, sans-serif;
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
`;
const ButtonS = exports.ButtonS = _styledComponents.default.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  padding: 0;
  min-width: 40px;
  min-height: 40px;
  border-radius: 5px;
  color: #333;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;

  img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }

  &:hover {
    background-color: ${color};
  }

  &.selected {
    background-color: ${color};
  }
`;
const ToolbarItemS = exports.ToolbarItemS = _styledComponents.default.div`
  margin: 0 2px;
`;
const SeparatorS = exports.SeparatorS = _styledComponents.default.div`
  margin: 0 4px;
  width: 1px;
  height: 30px;
  background: #cbcbcb;
`;
const ToolbarS = exports.ToolbarS = _styledComponents.default.div`
  padding: 4px 4px;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  z-index: 2;
`;
const ColorBarS = exports.ColorBarS = _styledComponents.default.div`
  position: absolute;
  top: 100px;
  left: 50px;
  transform: rotate(90deg);
  transform-origin: 0% 0%;
  padding: 0 0 0 4px;
  border-radius: 5px;
  display: flex;
  font-size: 12px;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  z-index: 2;

  > button {
    transform: rotate(-90deg);
  }
`;
const ZoomBarS = exports.ZoomBarS = _styledComponents.default.div`
  position: absolute;
  top: 100px;
  right: 0;
  padding: 4px 0;
  border-radius: 5px;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  z-index: 2;
`;
const ToolbarHolderS = exports.ToolbarHolderS = _styledComponents.default.div`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const PDFWrapperS = exports.PDFWrapperS = _styledComponents.default.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const ColorButtonS = exports.ColorButtonS = _styledComponents.default.button`
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 5px;
  border: none;
  background-color: ${_ref => {
  let {
    color
  } = _ref;
  return color;
}};
  outline: none;
  cursor: pointer;
`;
const RangeInputS = exports.RangeInputS = _styledComponents.default.input`
  & {
    margin: 10px 0;
    transform: rotate(180deg);
    width: 100px;
    height: 25px; /* Adjust height to control the width of the slider */
    -webkit-appearance: none;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    position: relative;
    width: 100%;
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
    // box-shadow: 0 1px 4px rgb(0 0 0 / 0.5);
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);
    border: 1px solid #fff;
    border-radius: 45px;
    height: ${_ref2 => {
  let {
    value
  } = _ref2;
  return (Number(value) || 18) + 2;
}}px;
    width: ${_ref3 => {
  let {
    value
  } = _ref3;
  return (Number(value) || 18) + 2;
}}px;
    background: ${_ref4 => {
  let {
    thumbcolor
  } = _ref4;
  return thumbcolor || '#232323';
}};
    cursor: pointer;
    margin-top: ${_ref5 => {
  let {
    value
  } = _ref5;
  return -value / 2 || -8;
}}px;
    -webkit-appearance: none;
  }
  &:focus::-webkit-slider-runnable-track {
    background: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
  }
  &::-moz-range-thumb {
    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);
    border: 1px solid #fff;
    border-radius: 45px;
    height: ${_ref6 => {
  let {
    value
  } = _ref6;
  return value + 2 || 20;
}}px;
    width: ${_ref7 => {
  let {
    value
  } = _ref7;
  return value + 2 || 20;
}}px;
    background: ${_ref8 => {
  let {
    thumbcolor
  } = _ref8;
  return thumbcolor || '#232323';
}};
    cursor: pointer;
    margin-top: ${_ref9 => {
  let {
    value
  } = _ref9;
  return -value / 2 || -8;
}}px;
  }

  &::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  &::-ms-fill-lower {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
  }
  &::-ms-fill-upper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
  }
  &::-ms-thumb {
    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);
    border: 1px solid #fff;
    border-radius: 45px;
    height: ${_ref10 => {
  let {
    value
  } = _ref10;
  return value + 2 || 20;
}}px;
    width: ${_ref11 => {
  let {
    value
  } = _ref11;
  return value + 2 || 20;
}}px;
    background: ${_ref12 => {
  let {
    thumbcolor
  } = _ref12;
  return thumbcolor || '#232323';
}};
    cursor: pointer;
    margin-top: ${_ref13 => {
  let {
    value
  } = _ref13;
  return -value / 2 || -8;
}}px;
  }
  &:focus::-ms-fill-lower {
    background: transparent;
  }
  &:focus::-ms-fill-upper {
    background: transparent;
  }
`;