"use strict";

exports.__esModule = true;
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactPdf = require("react-pdf");
var _PdfReader = require("./PdfReader.styled");
var _back = _interopRequireDefault(require("./../images/back.svg"));
var _next = _interopRequireDefault(require("./../images/next.svg"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/" + _reactPdf.pdfjs.version + "/pdf.worker.js";
const PDFReader = _ref => {
  let {
    fileReaderInfo,
    updateFileReaderInfo,
    onPageChange
  } = _ref;
  function onRenderSuccess() {
    const importPDFCanvas = document.querySelector('.import-pdf-page canvas');
    const pdfAsImageSrc = importPDFCanvas.toDataURL();
    updateFileReaderInfo({
      currentPage: pdfAsImageSrc
    });
  }
  function onDocumentLoadSuccess(_ref2) {
    let {
      numPages
    } = _ref2;
    console.log('onDocumentLoadSuccess', numPages);
    updateFileReaderInfo({
      totalPages: numPages
    });
  }
  function changePage(offset) {
    onPageChange(fileReaderInfo.currentPageNumber + offset);
  }
  const nextPage = () => changePage(1);
  const previousPage = () => changePage(-1);
  return /*#__PURE__*/_react.default.createElement(_PdfReader.PDFReaderS, null, /*#__PURE__*/_react.default.createElement(_PdfReader.FileContainer, null, /*#__PURE__*/_react.default.createElement(_reactPdf.Document, {
    file: fileReaderInfo.file,
    onLoadSuccess: onDocumentLoadSuccess,
    onLoadProgress: _ref3 => {
      let {
        loaded,
        total
      } = _ref3;
      return console.log('Loading a document: ' + loaded / total * 100 + '%');
    }
  }, /*#__PURE__*/_react.default.createElement(_reactPdf.Page, {
    className: "import-pdf-page",
    onRenderSuccess: onRenderSuccess,
    pageNumber: fileReaderInfo.currentPageNumber
  }))), fileReaderInfo.totalPages > 1 && /*#__PURE__*/_react.default.createElement(_PdfReader.PageInfoS, null, /*#__PURE__*/_react.default.createElement(_PdfReader.NavigationButton, {
    type: "button",
    disabled: fileReaderInfo.currentPageNumber <= 1,
    onClick: previousPage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _back.default,
    alt: "Back"
  })), /*#__PURE__*/_react.default.createElement(_PdfReader.PageInfoDetails, null, "Page\xA0", /*#__PURE__*/_react.default.createElement("b", null, fileReaderInfo.currentPageNumber), "\xA0of", ' ', fileReaderInfo.totalPages || '--'), /*#__PURE__*/_react.default.createElement(_PdfReader.NavigationButton, {
    type: "button",
    disabled: fileReaderInfo.currentPageNumber >= fileReaderInfo.totalPages,
    onClick: nextPage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _next.default,
    alt: "Next"
  }))));
};
var _default = exports.default = PDFReader;