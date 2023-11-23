"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _WhiteboardStyled = require("./Whiteboard.styled.js");

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

var _focus = _interopRequireDefault(require("./../images/focus.svg"));

var _initDrawingSettings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var initFileInfo = {
  file: {
    name: 'Whiteboard'
  },
  totalPages: 1,
  currentPageNumber: 1,
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

var defaultFunction = function defaultFunction(data, event, canvas) {};

var Whiteboard = function Whiteboard(_ref) {
  var _fileReaderInfo$file, _fileReaderInfo$file2;

  var controls = _ref.controls,
      settings = _ref.settings,
      drawingSettings = _ref.drawingSettings,
      fileInfo = _ref.fileInfo,
      _ref$onObjectAdded = _ref.onObjectAdded,
      onObjectAdded = _ref$onObjectAdded === void 0 ? defaultFunction : _ref$onObjectAdded,
      _ref$onObjectRemoved = _ref.onObjectRemoved,
      onObjectRemoved = _ref$onObjectRemoved === void 0 ? defaultFunction : _ref$onObjectRemoved,
      _ref$onObjectModified = _ref.onObjectModified,
      onObjectModified = _ref$onObjectModified === void 0 ? defaultFunction : _ref$onObjectModified,
      _ref$onCanvasRender = _ref.onCanvasRender,
      onCanvasRender = _ref$onCanvasRender === void 0 ? defaultFunction : _ref$onCanvasRender,
      _ref$onCanvasChange = _ref.onCanvasChange,
      onCanvasChange = _ref$onCanvasChange === void 0 ? defaultFunction : _ref$onCanvasChange,
      _ref$onZoom = _ref.onZoom,
      onZoom = _ref$onZoom === void 0 ? defaultFunction : _ref$onZoom,
      _ref$onImageUploaded = _ref.onImageUploaded,
      onImageUploaded = _ref$onImageUploaded === void 0 ? defaultFunction : _ref$onImageUploaded,
      _ref$onPDFUploaded = _ref.onPDFUploaded,
      onPDFUploaded = _ref$onPDFUploaded === void 0 ? defaultFunction : _ref$onPDFUploaded,
      _ref$onPDFUpdated = _ref.onPDFUpdated,
      onPDFUpdated = _ref$onPDFUpdated === void 0 ? defaultFunction : _ref$onPDFUpdated,
      _ref$onPageChange = _ref.onPageChange,
      onPageChange = _ref$onPageChange === void 0 ? defaultFunction : _ref$onPageChange,
      _ref$onOptionsChange = _ref.onOptionsChange,
      onOptionsChange = _ref$onOptionsChange === void 0 ? defaultFunction : _ref$onOptionsChange,
      _ref$onSaveCanvasAsIm = _ref.onSaveCanvasAsImage,
      onSaveCanvasAsImage = _ref$onSaveCanvasAsIm === void 0 ? defaultFunction : _ref$onSaveCanvasAsIm,
      _ref$onConfigChange = _ref.onConfigChange,
      onConfigChange = _ref$onConfigChange === void 0 ? defaultFunction : _ref$onConfigChange,
      _ref$onSaveCanvasStat = _ref.onSaveCanvasState,
      onSaveCanvasState = _ref$onSaveCanvasStat === void 0 ? defaultFunction : _ref$onSaveCanvasStat,
      _ref$onDocumentChange = _ref.onDocumentChanged,
      onDocumentChanged = _ref$onDocumentChange === void 0 ? defaultFunction : _ref$onDocumentChange;

  var _useState = (0, _react.useState)([]),
      canvasSaveData = _useState[0],
      setCanvasSaveData = _useState[1];

  var _useState2 = (0, _react.useState)(),
      board = _useState2[0],
      setBoard = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      canvasObjectsPerPage = _useState3[0],
      setCanvasObjectsPerPage = _useState3[1];

  var _useState4 = (0, _react.useState)(_extends({}, initDrawingSettings, drawingSettings)),
      canvasDrawingSettings = _useState4[0],
      setCanvasDrawingSettings = _useState4[1];

  var canvasConfig = _extends({}, initSettings, settings);

  var _useState5 = (0, _react.useState)(new Map().set(initFileInfo.file.name, initFileInfo.file)),
      documents = _useState5[0],
      setDocuments = _useState5[1];

  var _useState6 = (0, _react.useState)(canvasConfig.zoom),
      zoom = _useState6[0],
      setZoom = _useState6[1];

  var _useState7 = (0, _react.useState)(_extends({}, initFileInfo, fileInfo)),
      fileReaderInfo = _useState7[0],
      setFileReaderInfo = _useState7[1];

  var canvasRef = (0, _react.useRef)(null);
  var whiteboardRef = (0, _react.useRef)(null);
  var uploadPdfRef = (0, _react.useRef)(null);
  var enabledControls = (0, _react.useMemo)(function () {
    var _extends2;

    return _extends((_extends2 = {}, _extends2[_BoardClass.modes.PENCIL] = true, _extends2[_BoardClass.modes.LINE] = true, _extends2[_BoardClass.modes.RECTANGLE] = true, _extends2[_BoardClass.modes.ELLIPSE] = true, _extends2[_BoardClass.modes.TRIANGLE] = true, _extends2[_BoardClass.modes.TEXT] = true, _extends2[_BoardClass.modes.SELECT] = true, _extends2[_BoardClass.modes.ERASER] = true, _extends2.CLEAR = true, _extends2.FILL = true, _extends2.BRUSH = true, _extends2.COLOR_PICKER = true, _extends2.DEFAULT_COLORS = true, _extends2.FILES = true, _extends2.SAVE_AS_IMAGE = true, _extends2.GO_TO_START = true, _extends2.SAVE_AND_LOAD = true, _extends2.ZOOM = true, _extends2.TABS = true, _extends2), controls);
  }, [controls]);
  (0, _react.useEffect)(function () {
    setCanvasDrawingSettings(_extends({}, canvasDrawingSettings, drawingSettings));
  }, [drawingSettings]);
  (0, _react.useEffect)(function () {
    if (!board || !canvasConfig) return;
    board.setCanvasConfig(canvasConfig);
  }, [settings]);
  (0, _react.useEffect)(function () {
    setFileReaderInfo(_extends({}, fileReaderInfo, fileInfo));
  }, [fileInfo]);
  (0, _react.useEffect)(function () {
    if (board) {
      return;
    }

    var newBoard = new _BoardClass.Board({
      drawingSettings: canvasDrawingSettings,
      canvasConfig: canvasConfig,
      canvasRef: canvasRef // Sketch range limits

    });
    setBoard(newBoard);
    addListeners(newBoard.canvas);
    return function () {
      if (board) {
        board.removeBoard();
      }
    };
  }, [board]);
  (0, _react.useEffect)(function () {
    if (!board || !canvasDrawingSettings) return;
    board.setDrawingSettings(canvasDrawingSettings);
  }, [canvasDrawingSettings, board]); // useEffect(() => {
  //   if (!board || !canvasConfig) return;
  //   board.setCanvasConfig(canvasConfig);
  //   onConfigChange(canvasConfig, null, board.canvas);
  // }, [board, canvasConfig]);

  (0, _react.useEffect)(function () {
    if (!(board != null && board.canvas)) {
      return;
    }

    var json = getPageJSON({
      fileName: fileReaderInfo.file.name,
      pageNumber: fileReaderInfo.currentPageNumber
    });

    if (json) {
      board.canvas.loadFromJSON(json);
    } else {
      board.openPage(fileReaderInfo.currentPage);
    }
  }, [fileReaderInfo == null ? void 0 : (_fileReaderInfo$file = fileReaderInfo.file) == null ? void 0 : _fileReaderInfo$file.name, fileReaderInfo.currentPage]);

  function uploadImage(e) {
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.addEventListener('load', function () {
      _fabric.fabric.Image.fromURL(reader.result, function (img) {
        img.scaleToHeight(board.canvas.height);
        board.canvas.add(img);
      });
    });
    reader.readAsDataURL(file);
  }

  function addListeners(canvas) {
    canvas.on('after:render', function (e) {
      var data = getFullData(canvas);
      onCanvasRender(data, e, canvas);
    });
    canvas.on('zoom:change', function (data) {
      onZoom(data, null, canvas);
      setZoom(data.scale);
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
  }

  function handleSaveCanvasState() {
    var newCanvasState = board.canvas.toJSON();
    setCanvasSaveData(function (prevStates) {
      return [].concat(prevStates, [newCanvasState]);
    });
  }

  function handleLoadCanvasState(state) {
    if (board && state) {
      board.canvas.loadFromJSON(state, function () {
        board.canvas.renderAll();
      });
    }
  }

  function getFullData(canvas) {
    if (!canvas) return;
    return {
      settings: {
        contentJSON: canvas.toJSON(),
        viewportTransform: canvas.viewportTransform
      },
      drawingSettings: canvasDrawingSettings,
      fileInfo: fileReaderInfo
    };
  }

  function saveCanvasState() {
    var _extends3, _extends4;

    var newValue = _extends({}, canvasObjectsPerPage, (_extends4 = {}, _extends4[fileReaderInfo.file.name] = _extends({}, canvasObjectsPerPage[fileReaderInfo.file.name], (_extends3 = {}, _extends3[fileReaderInfo.currentPageNumber] = board.canvas.toJSON(), _extends3)), _extends4));

    setCanvasObjectsPerPage(newValue);
    console.log({
      newValue: newValue
    });
    onSaveCanvasState(newValue);
  }

  function changeBrushWidth(e) {
    var intValue = parseInt(e.target.value);
    board.canvas.freeDrawingBrush.width = intValue;

    var newOptions = _extends({}, canvasDrawingSettings, {
      brushWidth: intValue
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function changeMode(mode, e) {
    if (canvasDrawingSettings.currentMode === mode) return;

    var newOptions = _extends({}, canvasDrawingSettings, {
      currentMode: mode
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function changeCurrentColor(color, e) {
    board.canvas.freeDrawingBrush.color = color;

    var newOptions = _extends({}, canvasDrawingSettings, {
      currentColor: color
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function changeFill(e) {
    var newOptions = _extends({}, canvasDrawingSettings, {
      fill: !canvasDrawingSettings.fill
    });

    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function handleSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      (0, _fileSaver.saveAs)(blob, fileReaderInfo.file.name + "-" + (fileReaderInfo.currentPageNumber ? '_page-' : '') + ".png");
      onSaveCanvasAsImage(blob, null, board.canvas);
    });
  }

  function bringControlTOStartPosition() {
    board.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    board.resetZoom(1);
    board.nowX = 0;
    board.nowY = 0;
  }

  function onFileChange(event) {
    var _event$target, _event$target$files;

    var file = (_event$target = event.target) == null ? void 0 : (_event$target$files = _event$target.files) == null ? void 0 : _event$target$files[0];
    if (!file) return;

    if (file.type.includes('image/')) {
      uploadImage(event);
      onImageUploaded(file, event, board.canvas);
    } else if (file.type.includes('pdf')) {
      saveCanvasState();
      board.clearCanvas();
      updateFileReaderInfo({
        file: file,
        currentPageNumber: 1
      });
      setDocuments(function (prev) {
        return new Map(prev.set(file.name, file));
      });
      onPDFUploaded(file, event, board.canvas);
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
    onPDFUpdated(newFileData, null, board.canvas);
  }

  var handlePageChange = function handlePageChange(page) {
    saveCanvasState();
    board.clearCanvas(board.canvas);
    setFileReaderInfo(_extends({}, fileReaderInfo, {
      currentPageNumber: page
    }));
    onPageChange(_extends({}, fileReaderInfo, {
      currentPageNumber: page
    }), null, board.canvas);
  };

  var changeDocument = function changeDocument(name) {
    bringControlTOStartPosition();
    saveCanvasState();
    board.clearCanvas(board.canvas);
    setFileReaderInfo({
      file: documents.get(name),
      currentPageNumber: 1
    });
    onDocumentChanged({
      file: documents.get(name),
      currentPageNumber: 1
    }, null, board.canvas);
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
      return /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, {
        key: color
      }, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ColorButtonS, {
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
      return /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
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

  return /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.WrapperS, null, !!enabledControls.TABS && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.TabsS, null, Array.from(documents.keys()).map(function (document, index) {
    return /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.TabS, {
      key: index // Using index as a key if document is not unique
      ,
      onClick: function onClick() {
        return changeDocument(document);
      },
      style: document === fileReaderInfo.file.name ? {
        backgroundColor: 'rgba(0,0,0,0.1)'
      } : {}
    }, document);
  })), /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.WhiteBoardS, {
    ref: whiteboardRef
  }, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarHolderS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ColorBarS, null, !!enabledControls.COLOR_PICKER && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_ColorPicker.ColorPicker, {
    size: 28,
    color: canvasDrawingSettings.currentColor,
    onChange: changeCurrentColor
  })), !!enabledControls.BRUSH && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.RangeInputS, {
    type: "range",
    min: 1,
    max: 30,
    step: 1,
    thumbColor: canvasDrawingSettings.currentColor,
    value: canvasDrawingSettings.brushWidth,
    onChange: changeBrushWidth
  })), !!enabledControls.DEFAULT_COLORS && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, getColorButtons(['#6161ff', '#ff4f4f', '#3fd18d', '#ec70ff', '#000000'])), !!enabledControls.FILL && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    type: "button",
    className: canvasDrawingSettings.fill ? 'selected' : '',
    onClick: changeFill
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _colorFill.default,
    alt: "Delete"
  }))), /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarS, null, getControls(), !!enabledControls.CLEAR && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    type: "button",
    onClick: function onClick() {
      return board.clearCanvas();
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _delete.default,
    alt: "Delete"
  })), /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.SeparatorS, null), !!enabledControls.FILES && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadPdfRef,
    hidden: true,
    accept: "image/*,.pdf",
    type: "file",
    onChange: onFileChange
  }), /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    onClick: function onClick() {
      return uploadPdfRef.current.click();
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _addPhoto.default,
    alt: "Delete"
  }))), !!enabledControls.SAVE_AS_IMAGE && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    onClick: handleSaveCanvasAsImage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _download.default,
    alt: "Download"
  }))), !!enabledControls.GO_TO_START && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    onClick: bringControlTOStartPosition
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _focus.default,
    alt: "Recenter"
  }))), !!enabledControls.SAVE_AND_LOAD && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    type: "button",
    onClick: handleSaveCanvasState
  }, "Save")), !!enabledControls.SAVE_AND_LOAD && canvasSaveData && canvasSaveData.length > 0 && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    onClick: function onClick() {
      return handleLoadCanvasState(canvasSaveData[0]);
    }
  }, "Load"))), /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ZoomBarS, null, !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    onClick: handleZoomIn,
    title: "Zoom In"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _zoomIn.default,
    alt: "Zoom In"
  }))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    onClick: handleResetZoom,
    title: "Reset Zoom"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '11px'
    }
  }, Math.floor(zoom * 100), "%"))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
    onClick: handleZoomOut,
    title: "Zoom Out"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _zoomOut.default,
    alt: "Zoom Out"
  }))))), /*#__PURE__*/_react.default.createElement("canvas", {
    style: {
      zIndex: 1
    },
    ref: canvasRef,
    id: "canvas"
  }), !!(fileReaderInfo != null && (_fileReaderInfo$file2 = fileReaderInfo.file) != null && _fileReaderInfo$file2.size) && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.PDFWrapperS, null, /*#__PURE__*/_react.default.createElement(_PdfReader.PdfReader, {
    fileReaderInfo: fileReaderInfo,
    onPageChange: handlePageChange,
    updateFileReaderInfo: updateFileReaderInfo
  }))));
};

Whiteboard.propTypes = {
  aspectRatio: _propTypes.default.number
};
var _default = Whiteboard;
exports.default = _default;