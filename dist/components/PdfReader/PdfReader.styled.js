"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageInfoS = exports.PageInfoDetails = exports.PDFReaderS = exports.NavigationButton = exports.FileContainer = void 0;
var _styledComponents = _interopRequireDefault(require("styled-components"));
const PDFReaderS = exports.PDFReaderS = _styledComponents.default.div`
  width: 100%;
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  background-color: 'red';
`;
const FileContainer = exports.FileContainer = _styledComponents.default.div`
  display: none;
`;
const PageInfoS = exports.PageInfoS = _styledComponents.default.div`
  position: absolute;
  z-index: 2;
  bottom: 50px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: none;
  margin-bottom: 10px;
  overflow: hidden;
`;
const PageInfoDetails = exports.PageInfoDetails = _styledComponents.default.span`
  color: #333;
  display: flex;
  align-items: center;
  padding: 0 1em;
`;
const NavigationButton = exports.NavigationButton = _styledComponents.default.button`
  padding: 12px;
  width: 40px;
  height: 40px;
  border: none;
  color: #333;
  background-color: transparent;
  outline: none;
  cursor: pointer;

  img {
    width: 16px;
    vertical-align: middle;
  }

  &:hover {
    background-color: #eee;
  }
`;