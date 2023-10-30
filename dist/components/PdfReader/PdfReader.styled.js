"use strict";

exports.__esModule = true;
exports.PageInfoS = exports.PageInfoDetails = exports.PDFReaderS = exports.NavigationButton = exports.FileContainer = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _theme = _interopRequireDefault(require("../../theme"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var PDFReaderS = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  width: 100%;\n  display: flex;\n  font-size: 14px;\n  justify-content: center;\n  align-items: center;\n"])));

exports.PDFReaderS = PDFReaderS;

var FileContainer = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteralLoose(["\n  display: none;\n"])));

exports.FileContainer = FileContainer;

var PageInfoS = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteralLoose(["\n  position: absolute;\n  z-index: 2;\n  bottom: 50px;\n  display: flex;\n  align-items: center;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n  border: none;\n  margin-bottom: 10px;\n  overflow: hidden;\n"])));

exports.PageInfoS = PageInfoS;

var PageInfoDetails = _styledComponents.default.span(_templateObject4 || (_templateObject4 = _taggedTemplateLiteralLoose(["\n  color: #333;\n  display: flex;\n  align-items: center;\n  padding: 0 1em;\n"])));

exports.PageInfoDetails = PageInfoDetails;

var NavigationButton = _styledComponents.default.button(_templateObject5 || (_templateObject5 = _taggedTemplateLiteralLoose(["\n  padding: 12px;\n  width: 40px;\n  height: 40px;\n  border: none;\n  color: #333;\n  background-color: transparent;\n  outline: none;\n  cursor: pointer;\n\n  img {\n    width: 16px;\n    vertical-align: middle;\n  }\n\n  &:hover {\n    background-color: #eee;\n  }\n"])));

exports.NavigationButton = NavigationButton;