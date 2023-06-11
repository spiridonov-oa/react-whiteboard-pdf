"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Whiteboard = require("./Whiteboard.styled");

var _fabric = require("fabric");

var _PdfReader = require("../PdfReader");

var _fileSaver = require("file-saver");

var _BoardClass = require("./Board.Class.js");

var _ColorPicker = require("../ColorPicker");

var _cross = _interopRequireDefault(require("./../images/cross.svg"));

var _eraser = _interopRequireDefault(require("./../images/eraser.svg"));

var _text = _interopRequireDefault(require("./../images/text.svg"));

var _rectangle = _interopRequireDefault(require("./../images/rectangle.svg"));

var _line = _interopRequireDefault(require("./../images/line.svg"));

var _ellipse = _interopRequireDefault(require("./../images/ellipse.svg"));

var _triangle = _interopRequireDefault(require("./../images/triangle.svg"));

var _pencil = _interopRequireDefault(require("./../images/pencil.svg"));

var _delete = _interopRequireDefault(require("./../images/delete.svg"));

var _zoomIn = _interopRequireDefault(require("./../images/zoom-in.svg"));

var _zoomOut = _interopRequireDefault(require("./../images/zoom-out.svg"));

var _download = _interopRequireDefault(require("./../images/download.svg"));

var _addPhoto = _interopRequireDefault(require("./../images/add-photo.svg"));

var _colorFill = _interopRequireDefault(require("./../images/color-fill.svg"));

var _initDrawingSettings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var initFileInfo = {
  file: {
    name: 'whiteboard'
  },
  totalPages: 1,
  currentPageNumber: 0,
  currentPage: ''
};
var initDrawingSettings = (_initDrawingSettings = {
  brushWidth: 5,
  currentMode: 'PENCIL',
  currentColor: '#000000'
}, _initDrawingSettings["brushWidth"] = 5, _initDrawingSettings.fill = false, _initDrawingSettings);
var initSettings = {
  zoom: 1,
  contentJSON: null
};

var Whiteboard = function Whiteboard(_ref) {
  var _ref$controls = _ref.controls,
      controls = _ref$controls === void 0 ? {} : _ref$controls,
      _ref$settings = _ref.settings,
      settings = _ref$settings === void 0 ? {} : _ref$settings,
      _ref$drawingSettings = _ref.drawingSettings,
      drawingSettings = _ref$drawingSettings === void 0 ? {} : _ref$drawingSettings,
      _ref$fileInfo = _ref.fileInfo,
      fileInfo = _ref$fileInfo === void 0 ? {} : _ref$fileInfo,
      _ref$onObjectAdded = _ref.onObjectAdded,
      onObjectAdded = _ref$onObjectAdded === void 0 ? function (data, event, canvas) {} : _ref$onObjectAdded,
      _ref$onObjectRemoved = _ref.onObjectRemoved,
      onObjectRemoved = _ref$onObjectRemoved === void 0 ? function (data, event, canvas) {} : _ref$onObjectRemoved,
      _ref$onObjectModified = _ref.onObjectModified,
      onObjectModified = _ref$onObjectModified === void 0 ? function (data, event, canvas) {} : _ref$onObjectModified,
      _ref$onCanvasRender = _ref.onCanvasRender,
      onCanvasRender = _ref$onCanvasRender === void 0 ? function (data, event, canvas) {} : _ref$onCanvasRender,
      _ref$onCanvasChange = _ref.onCanvasChange,
      onCanvasChange = _ref$onCanvasChange === void 0 ? function (data, event, canvas) {} : _ref$onCanvasChange,
      _ref$onZoom = _ref.onZoom,
      onZoom = _ref$onZoom === void 0 ? function (data, event, canvas) {} : _ref$onZoom,
      _ref$onImageUploaded = _ref.onImageUploaded,
      onImageUploaded = _ref$onImageUploaded === void 0 ? function (data, event, canvas) {} : _ref$onImageUploaded,
      _ref$onPDFUploaded = _ref.onPDFUploaded,
      onPDFUploaded = _ref$onPDFUploaded === void 0 ? function (data, event, canvas) {} : _ref$onPDFUploaded,
      _ref$onPDFUpdated = _ref.onPDFUpdated,
      onPDFUpdated = _ref$onPDFUpdated === void 0 ? function (data, event, canvas) {} : _ref$onPDFUpdated,
      _ref$onPageChange = _ref.onPageChange,
      onPageChange = _ref$onPageChange === void 0 ? function (data, event, canvas) {} : _ref$onPageChange,
      _ref$onOptionsChange = _ref.onOptionsChange,
      onOptionsChange = _ref$onOptionsChange === void 0 ? function (data, event, canvas) {} : _ref$onOptionsChange,
      _ref$onSaveCanvasAsIm = _ref.onSaveCanvasAsImage,
      onSaveCanvasAsImage = _ref$onSaveCanvasAsIm === void 0 ? function (data, event, canvas) {} : _ref$onSaveCanvasAsIm,
      _ref$onLoadFromJSON = _ref.onLoadFromJSON,
      onLoadFromJSON = _ref$onLoadFromJSON === void 0 ? function (data, event, canvas) {} : _ref$onLoadFromJSON,
      _ref$onSaveCanvasStat = _ref.onSaveCanvasState,
      onSaveCanvasState = _ref$onSaveCanvasStat === void 0 ? function (data, event, canvas) {} : _ref$onSaveCanvasStat;

  var _useState = (0, _react.useState)(null),
      canvas = _useState[0],
      setCanvas = _useState[1];

  var _useState2 = (0, _react.useState)(),
      board = _useState2[0],
      setBoard = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      canvasObjectsPerPage = _useState3[0],
      setCanvasObjectsPerPage = _useState3[1];

  var _useState4 = (0, _react.useState)(_extends({}, initDrawingSettings, drawingSettings)),
      canvasDrawingSettings = _useState4[0],
      setCanvasDrawingSettings = _useState4[1];

  var _useState5 = (0, _react.useState)(_extends({}, initSettings, settings)),
      canvasSettings = _useState5[0],
      setCanvasSettings = _useState5[1];

  var _useState6 = (0, _react.useState)(_extends({}, initFileInfo, fileInfo)),
      fileReaderInfo = _useState6[0],
      setFileReaderInfo = _useState6[1];

  var canvasRef = (0, _react.useRef)(null);
  var whiteboardRef = (0, _react.useRef)(null);
  var uploadPdfRef = (0, _react.useRef)(null);
  var enabledControls = (0, _react.useMemo)(function () {
    var _extends2;

    return _extends((_extends2 = {}, _extends2[_BoardClass.modes.PENCIL] = true, _extends2[_BoardClass.modes.LINE] = true, _extends2[_BoardClass.modes.RECTANGLE] = true, _extends2[_BoardClass.modes.ELLIPSE] = true, _extends2[_BoardClass.modes.TRIANGLE] = true, _extends2[_BoardClass.modes.TEXT] = true, _extends2[_BoardClass.modes.SELECT] = true, _extends2[_BoardClass.modes.ERASER] = true, _extends2.CLEAR = true, _extends2.FILL = true, _extends2.BRUSH = true, _extends2.COLOR_PICKER = true, _extends2.DEFAULT_COLORS = true, _extends2.FILES = true, _extends2.SAVE_AS_IMAGE = true, _extends2.ZOOM = true, _extends2), controls);
  }, [controls]);
  (0, _react.useEffect)(function () {
    var board = new _BoardClass.Board({
      width: whiteboardRef.current.clientWidth,
      height: whiteboardRef.current.clientHeight,
      drawingSettings: canvasDrawingSettings,
      canvasSettings: canvasSettings
    });
    setCanvas(board.canvas);
    setBoard(board);
    return function () {
      if (board) {
        board.removeBoard();
      }
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (!canvas || !canvasSettings.contentJSON) return;
    canvas.loadFromJSON(canvasSettings.contentJSON);
    onLoadFromJSON(canvasSettings.contentJSON, null, canvas);
  }, [canvas, canvasSettings.contentJSON]);
  (0, _react.useEffect)(function () {
    if (!board) return;
    return function () {
      board.removeBoard();
    };
  }, [board]);
  (0, _react.useEffect)(function () {
    if (!canvas) return;
    canvas.on('after:render', function (e) {
      onCanvasRender(canvas, e, canvas);
    });
    canvas.on('zoom', function (data) {
      onZoom(data, null, canvas);
      setCanvasSettings(_extends({}, canvasSettings, {
        zoom: data.scale
      }));
    });
    canvas.on('object:added', function (event) {
      onObjectAdded(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });
    canvas.on('object:removed', function (event) {
      onObjectRemoved(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });
    canvas.on('object:modified', function (event) {
      onObjectModified(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });
    return function () {
      if (!canvas) return;
      canvas.dispose();
    };
  }, [canvas]);
  (0, _react.useEffect)(function () {
    if (!canvas || !fileReaderInfo.currentPage) {
      return;
    }

    var json = getPageJSON({
      fileName: fileReaderInfo.file.name,
      pageNumber: fileReaderInfo.currentPageNumber
    });

    if (json) {
      canvas.loadFromJSON(json);
    } else {
      board.openPage(fileReaderInfo.currentPage);
    }
  }, [fileReaderInfo.currentPage]);
  (0, _react.useEffect)(function () {
    if (!board) return;
    board.setDrawingSettings(canvasDrawingSettings);
  }, [canvasDrawingSettings, board]);

  function uploadImage(e) {
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.addEventListener('load', function () {
      _fabric.fabric.Image.fromURL(reader.result, function (img) {
        img.scaleToHeight(canvas.height);
        canvas.add(img);
      });
    });
    reader.readAsDataURL(file);
  }

  function saveCanvasState() {
    var _extends3, _extends4;

    var newValue = _extends({}, canvasObjectsPerPage, (_extends4 = {}, _extends4[fileReaderInfo.file.name] = _extends({}, canvasObjectsPerPage[fileReaderInfo.file.name], (_extends3 = {}, _extends3[fileReaderInfo.currentPageNumber] = canvas.toJSON(), _extends3)), _extends4));

    setCanvasObjectsPerPage(newValue);
    onSaveCanvasState(newValue);
  }

  function changeBrushWidth(e) {
    var intValue = parseInt(e.target.value);
    canvas.freeDrawingBrush.width = intValue;

    var newOptions = _extends({}, canvasDrawingSettings, {
      brushWidth: intValue
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeMode(mode, e) {
    if (canvasDrawingSettings.currentMode === mode) return;

    var newOptions = _extends({}, canvasDrawingSettings, {
      currentMode: mode
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeCurrentColor(color, e) {
    canvas.freeDrawingBrush.color = color;

    var newOptions = _extends({}, canvasDrawingSettings, {
      currentColor: color
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeFill(e) {
    var newOptions = _extends({}, canvasDrawingSettings, {
      fill: !canvasDrawingSettings.fill
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function handleSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      (0, _fileSaver.saveAs)(blob, "" + fileReaderInfo.file.name + (fileReaderInfo.currentPage ? '_page-' : '') + ".png");
      onSaveCanvasAsImage(blob, null, canvas);
    });
  }

  function onFileChange(event) {
    if (!event.target.files[0]) return;

    if (event.target.files[0].type.includes('image/')) {
      uploadImage(event);
      onImageUploaded(event.target.files[0], event, canvas);
    } else if (event.target.files[0].type.includes('pdf')) {
      saveCanvasState();
      board.clearCanvas();
      updateFileReaderInfo({
        file: event.target.files[0],
        currentPageNumber: 1
      });
      onPDFUploaded(event.target.files[0], event, canvas);
    }
  }

  function getPageJSON(_ref2) {
    var fileName = _ref2.fileName,
        pageNumber = _ref2.pageNumber;

    if (canvasObjectsPerPage[fileName] && canvasObjectsPerPage[fileName][pageNumber]) {
      return canvasObjectsPerPage[fileName][pageNumber];
    } else {
      return null;
    }
  }

  function updateFileReaderInfo(data) {
    var newFileData = _extends({}, fileReaderInfo, data);

    setFileReaderInfo(newFileData);
    onPDFUpdated(newFileData, null, canvas);
  }

  var handlePageChange = function handlePageChange(page) {
    saveCanvasState();
    board.clearCanvas(canvas);
    setFileReaderInfo(_extends({}, fileReaderInfo, {
      currentPageNumber: page
    }));
    onPageChange(_extends({}, fileReaderInfo, {
      currentPageNumber: page
    }), null, canvas);
  };

  var handleZoomIn = function handleZoomIn() {
    board.changeZoom({
      scale: 1.1
    });
  };

  var handleZoomOut = function handleZoomOut() {
    board.changeZoom({
      scale: 0.9
    });
  };

  var handleResetZoom = function handleResetZoom() {
    board.resetZoom(1);
  };

  var getColorButtons = function getColorButtons(colors) {
    return colors.map(function (color) {
      return /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, {
        key: color
      }, /*#__PURE__*/_react.default.createElement(_Whiteboard.ColorButtonS, {
        color: color,
        onClick: function onClick(e) {
          return changeCurrentColor(color, e);
        }
      }));
    });
  };

  var getControls = function getControls() {
    var _modeButtons;

    var modeButtons = (_modeButtons = {}, _modeButtons[_BoardClass.modes.PENCIL] = {
      icon: _pencil.default,
      name: 'Pencil'
    }, _modeButtons[_BoardClass.modes.LINE] = {
      icon: _line.default,
      name: 'Line'
    }, _modeButtons[_BoardClass.modes.RECTANGLE] = {
      icon: _rectangle.default,
      name: 'Rectangle'
    }, _modeButtons[_BoardClass.modes.ELLIPSE] = {
      icon: _ellipse.default,
      name: 'Ellipse'
    }, _modeButtons[_BoardClass.modes.TRIANGLE] = {
      icon: _triangle.default,
      name: 'Triangle'
    }, _modeButtons[_BoardClass.modes.TEXT] = {
      icon: _text.default,
      name: 'Text'
    }, _modeButtons[_BoardClass.modes.SELECT] = {
      icon: _cross.default,
      name: 'Select'
    }, _modeButtons[_BoardClass.modes.ERASER] = {
      icon: _eraser.default,
      name: 'Eraser'
    }, _modeButtons);
    return Object.keys(modeButtons).map(function (buttonKey) {
      if (!enabledControls[buttonKey]) return;
      var btn = modeButtons[buttonKey];
      return /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
        key: buttonKey,
        type: "button",
        className: "" + (canvasDrawingSettings.currentMode === buttonKey ? 'selected' : ''),
        onClick: function onClick(e) {
          return changeMode(buttonKey, e);
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: btn.icon,
        alt: btn.name
      }));
    });
  };

  return /*#__PURE__*/_react.default.createElement(_Whiteboard.WhiteBoardS, {
    ref: whiteboardRef
  }, /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarHolderS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ColorBarS, null, !!enabledControls.COLOR_PICKER && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_ColorPicker.ColorPicker, {
    size: 28,
    color: canvasDrawingSettings.currentColor,
    onChange: changeCurrentColor
  })), !!enabledControls.BRUSH && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.RangeInputS, {
    type: "range",
    min: 1,
    max: 30,
    step: 1,
    thumbColor: canvasDrawingSettings.currentColor,
    value: canvasDrawingSettings.brushWidth,
    onChange: changeBrushWidth
  })), !!enabledControls.DEFAULT_COLORS && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, getColorButtons(['#6161ff', '#ff4f4f', '#3fd18d', '#ec70ff', '#000000'])), !!enabledControls.FILL && /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    type: "button",
    className: canvasDrawingSettings.fill ? 'selected' : '',
    onClick: changeFill
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _colorFill.default,
    alt: "Delete"
  }))), /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarS, null, getControls(), !!enabledControls.CLEAR && /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    type: "button",
    onClick: function onClick() {
      return board.clearCanvas();
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _delete.default,
    alt: "Delete"
  })), /*#__PURE__*/_react.default.createElement(_Whiteboard.SeparatorS, null), !!enabledControls.FILES && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadPdfRef,
    hidden: true,
    accept: "image/*,.pdf",
    type: "file",
    onChange: onFileChange
  }), /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: function onClick() {
      return uploadPdfRef.current.click();
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _addPhoto.default,
    alt: "Delete"
  }))), !!enabledControls.SAVE_AS_IMAGE && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleSaveCanvasAsImage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _download.default,
    alt: "Download"
  })))), /*#__PURE__*/_react.default.createElement(_Whiteboard.ZoomBarS, null, !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleZoomIn,
    title: "Zoom In"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _zoomIn.default,
    alt: "Zoom In"
  }))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleResetZoom,
    title: "Reset Zoom"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '11px'
    }
  }, Math.floor(canvasSettings.zoom * 100), "%"))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleZoomOut,
    title: "Zoom Out"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _zoomOut.default,
    alt: "Zoom Out"
  }))))), /*#__PURE__*/_react.default.createElement("canvas", {
    ref: canvasRef,
    id: "canvas"
  }), /*#__PURE__*/_react.default.createElement(_Whiteboard.PDFWrapperS, null, /*#__PURE__*/_react.default.createElement(_PdfReader.PdfReader, {
    fileReaderInfo: fileReaderInfo,
    onPageChange: handlePageChange,
    updateFileReaderInfo: updateFileReaderInfo
  })));
};

Whiteboard.propTypes = {
  aspectRatio: _propTypes.default.number
};
var _default = Whiteboard;
exports.default = _default;