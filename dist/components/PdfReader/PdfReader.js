"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactPdf = require("react-pdf");
var _PdfReader = require("./PdfReader.styled");
var _back = _interopRequireDefault(require("./../images/back.svg"));
var _next = _interopRequireDefault(require("./../images/next.svg"));
require("react-pdf/dist/esm/Page/TextLayer.css");
require("react-pdf/dist/esm/Page/AnnotationLayer.css");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Add these two imports for react-pdf text layer support

// Fix worker loading by using HTTPS and ensuring version compatibility
_reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
const PDFReader = _ref => {
  let {
    fileReaderInfo,
    file,
    viewportTransform,
    updateFileReaderInfo,
    onPageChange = pageNumber => {}
  } = _ref;
  const [currentPageNumber, setCurrentPageNumber] = (0, _react.useState)((fileReaderInfo === null || fileReaderInfo === void 0 ? void 0 : fileReaderInfo.currentPageNumber) || 0);
  const [totalPages, setTotalPages] = (0, _react.useState)((fileReaderInfo === null || fileReaderInfo === void 0 ? void 0 : fileReaderInfo.totalPages) || 0);
  const [loadingProgress, setLoadingProgress] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    if (fileReaderInfo) {
      setCurrentPageNumber(fileReaderInfo.currentPageNumber);
      setTotalPages(fileReaderInfo.totalPages);
    }
  }, [fileReaderInfo]);
  const onRenderSuccess = (0, _react.useCallback)(() => {
    try {
      const importPDFCanvas = document.querySelector('.import-pdf-page canvas');
      if (!importPDFCanvas) {
        console.error('PDF canvas element not found');
        return;
      }
      const pdfAsImageSrc = importPDFCanvas.toDataURL();
      updateFileReaderInfo({
        currentPage: pdfAsImageSrc,
        file,
        totalPages,
        currentPageNumber
      });
    } catch (error) {
      console.error('Error converting PDF to image:', error);
    }
  }, [file, totalPages, currentPageNumber, updateFileReaderInfo]);
  const onDocumentLoadSuccess = (0, _react.useCallback)(_ref2 => {
    let {
      numPages
    } = _ref2;
    setTotalPages(numPages);
    setCurrentPageNumber(0);
    updateFileReaderInfo({
      totalPages: numPages,
      currentPageNumber: 0,
      file: file
    });
  }, [fileReaderInfo, updateFileReaderInfo]);
  const changePage = (0, _react.useCallback)(offset => {
    const newPageNumber = currentPageNumber + offset;
    if (newPageNumber < 0 || newPageNumber >= totalPages) {
      return;
    }
    setCurrentPageNumber(newPageNumber);
    onPageChange(newPageNumber);
  }, [currentPageNumber, totalPages, onPageChange]);
  const nextPage = (0, _react.useCallback)(() => changePage(1), [changePage]);
  const previousPage = (0, _react.useCallback)(() => changePage(-1), [changePage]);
  const handleLoadProgress = (0, _react.useCallback)(_ref3 => {
    let {
      loaded,
      total
    } = _ref3;
    const progress = Math.round(loaded / total * 100);
    setLoadingProgress(progress);
    console.log(`Loading document: ${progress}%`);
  }, []);

  // Create a transform string from the viewportTransform matrix
  const transformStyle = {
    width: `100%`,
    transform: `matrix(${viewportTransform.join(', ')})`,
    transformOrigin: '0 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };
  if (!file) {
    return /*#__PURE__*/_react.default.createElement("div", null);
  }
  return /*#__PURE__*/_react.default.createElement(_PdfReader.PDFReaderS, null, /*#__PURE__*/_react.default.createElement("div", {
    style: transformStyle
  }, /*#__PURE__*/_react.default.createElement(_PdfReader.FileContainer, null, /*#__PURE__*/_react.default.createElement(_reactPdf.Document, {
    file: file,
    className: "pdf-document",
    onLoadSuccess: onDocumentLoadSuccess,
    onLoadProgress: handleLoadProgress,
    error: /*#__PURE__*/_react.default.createElement("div", null, "An error occurred while loading the PDF."),
    loading: /*#__PURE__*/_react.default.createElement("div", null, "Loading PDF... ", loadingProgress, "%")
  }, /*#__PURE__*/_react.default.createElement(_reactPdf.Page, {
    className: "import-pdf-page",
    onRenderSuccess: onRenderSuccess,
    pageNumber: currentPageNumber + 1,
    height: 1000
    //scale={zoom * 1.3}
    ,
    renderTextLayer: false,
    renderAnnotationLayer: false,
    error: /*#__PURE__*/_react.default.createElement("div", null, "An error occurred while rendering the page.")
  })))), totalPages > 1 && /*#__PURE__*/_react.default.createElement(_PdfReader.PageInfoS, null, /*#__PURE__*/_react.default.createElement(_PdfReader.NavigationButton, {
    type: "button",
    disabled: currentPageNumber <= 0,
    onClick: previousPage,
    "aria-label": "Previous page"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _back.default,
    alt: "Back"
  })), /*#__PURE__*/_react.default.createElement(_PdfReader.PageInfoDetails, null, "Page\xA0", /*#__PURE__*/_react.default.createElement("b", null, currentPageNumber + 1), "\xA0of ", totalPages || '--'), /*#__PURE__*/_react.default.createElement(_PdfReader.NavigationButton, {
    type: "button",
    disabled: currentPageNumber + 1 >= totalPages,
    onClick: nextPage,
    "aria-label": "Next page"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _next.default,
    alt: "Next"
  }))));
};
var _default = exports.default = PDFReader;