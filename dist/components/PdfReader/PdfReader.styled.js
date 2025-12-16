"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageInfoS = exports.PageInfoDetails = exports.PDFReaderS = exports.NavigationButton = exports.FileContainer = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
const PDFReaderS = exports.PDFReaderS = _styledComponents.default.div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  flex: 1;\n  display: flex;\n  width: 100%;\n  height: 100%;\n  font-size: 14px;\n  justify-content: flex-start;\n  align-items: flex-start;\n  overflow: hidden;\n"])));
const FileContainer = exports.FileContainer = _styledComponents.default.div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  margin: 0 auto;\n  width: 100%;\n  display: flex;\n  justify-content: flex-start;\n  flex-shrink: 0;\n\n  .pdf-document {\n    flex-shrink: 0;\n  }\n\n  .import-pdf-page {\n    canvas {\n      max-width: 100%;\n    }\n  }\n"])));
const PageInfoS = exports.PageInfoS = _styledComponents.default.div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  z-index: 2;\n  left: 5px;\n  bottom: 5px;\n  display: flex;\n  align-items: center;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n  border: none;\n  overflow: hidden;\n"])));
const PageInfoDetails = exports.PageInfoDetails = _styledComponents.default.span(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  color: #333;\n  display: flex;\n  align-items: center;\n  padding: 0 1em;\n"])));
const NavigationButton = exports.NavigationButton = _styledComponents.default.button(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 12px;\n  width: 40px;\n  height: 40px;\n  border: none;\n  color: #333;\n  background-color: transparent;\n  outline: none;\n  cursor: pointer;\n\n  img {\n    width: 16px;\n    vertical-align: middle;\n  }\n\n  &:hover {\n    background-color: #eee;\n  }\n"])));