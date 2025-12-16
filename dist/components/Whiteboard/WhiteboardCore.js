"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
require("../PdfReader/TextLayer.css");
require("../PdfReader/AnnotationLayer.css");
var _Whiteboard = require("./Whiteboard.styled");
var _index = require("../PdfReader/index");
var _fileSaver = require("file-saver");
var _Board = require("../Board/Board.Class");
var _ColorPicker = require("../ColorPicker");
var _cursor = _interopRequireDefault(require("./../images/cursor.svg"));
var _eraserIcon = _interopRequireDefault(require("./../images/eraser-icon.svg"));
var _text = _interopRequireDefault(require("./../images/text.svg"));
var _rectangle = _interopRequireDefault(require("./../images/rectangle.svg"));
var _line = _interopRequireDefault(require("./../images/line.svg"));
var _ellipse = _interopRequireDefault(require("./../images/ellipse.svg"));
var _triangle = _interopRequireDefault(require("./../images/triangle.svg"));
var _pencilEdit = _interopRequireDefault(require("./../images/pencil-edit.svg"));
var _delete = _interopRequireDefault(require("./../images/delete.svg"));
var _zoomIn = _interopRequireDefault(require("./../images/zoom-in.svg"));
var _zoomOut = _interopRequireDefault(require("./../images/zoom-out.svg"));
var _download = _interopRequireDefault(require("./../images/download.svg"));
var _pdfFile = _interopRequireDefault(require("./../images/pdf-file.svg"));
var _addPhoto = _interopRequireDefault(require("./../images/add-photo.svg"));
var _colorFill = _interopRequireDefault(require("./../images/color-fill.svg"));
var _centerFocus = _interopRequireDefault(require("./../images/center-focus.svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } // Add these two imports for react-pdf text layer support
const fn = () => {};
const defaultFunction = (data, event, canvas) => {};
const WhiteboardCore = _ref => {
  let {
    controls,
    activeTabState,
    activeTabIndex,
    documents,
    fileInfo,
    canvasList,
    contentJSON,
    drawingSettings,
    pageData,
    imageSlot,
    style,
    onFileAdded,
    onObjectAdded = defaultFunction,
    onObjectRemoved = defaultFunction,
    onObjectModified = defaultFunction,
    onCanvasRender = fn,
    onCanvasChange = defaultFunction,
    onZoom = defaultFunction,
    onImageUploaded = defaultFunction,
    onPDFUploaded = defaultFunction,
    onPDFUpdated = defaultFunction,
    onPageChange,
    onOptionsChange = defaultFunction,
    onSaveCanvasAsImage = defaultFunction,
    onConfigChange = defaultFunction
  } = _ref;
  const [canvasSaveData, setCanvasSaveData] = (0, _react.useState)([]);
  const boardRef = (0, _react.useRef)(null);
  const [resizedCount, setResizedCount] = (0, _react.useState)(1);
  const [canvasReady, setCanvasReady] = (0, _react.useState)(false);
  // const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const [zoom, setZoom] = (0, _react.useState)(pageData.zoom);
  const [viewportTransform, setViewportTransform] = (0, _react.useState)(pageData.viewportTransform);
  const canvasRef = (0, _react.useRef)(null);
  const whiteboardRef = (0, _react.useRef)(null);
  const uploadPdfRef = (0, _react.useRef)(null);
  const uploadImageRef = (0, _react.useRef)(null);
  const enabledControls = (0, _react.useMemo)(function () {
    return _objectSpread({
      [_Board.modes.PENCIL]: true,
      [_Board.modes.LINE]: true,
      [_Board.modes.RECTANGLE]: true,
      [_Board.modes.ELLIPSE]: true,
      [_Board.modes.TRIANGLE]: true,
      [_Board.modes.TEXT]: true,
      [_Board.modes.SELECT]: true,
      [_Board.modes.ERASER]: true,
      CLEAR: true,
      FILL: true,
      BRUSH: true,
      COLOR_PICKER: true,
      DEFAULT_COLORS: true,
      FILES: true,
      SAVE_AS_IMAGE: false,
      GO_TO_START: true,
      SAVE_AND_LOAD: false,
      ZOOM: true,
      TABS: true
    }, controls);
  }, [controls]);
  (0, _react.useEffect)(() => {
    if (imageSlot) {
      fileChanger(imageSlot);
    }
  }, [imageSlot]);
  (0, _react.useEffect)(() => {
    if (!canvasRef.current) return;
    const newBoard = new _Board.Board({
      drawingSettings: drawingSettings,
      canvasConfig: pageData,
      canvasRef: canvasRef
    });
    canvasList.current.set(activeTabIndex, newBoard.canvas);
    boardRef.current = newBoard;
    boardRef.current.setCanvasConfig(pageData);
    addListeners(newBoard.canvas);
    return () => {
      if (newBoard) {
        newBoard.removeBoard();
      }
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount) return;
    boardRef.current.setCanvasConfig(pageData);
    onConfigChange(pageData, null, boardRef.current.canvas);
  }, [pageData, resizedCount]);
  (0, _react.useEffect)(() => {
    var _boardRef$current;
    if (!boardRef.current || !resizedCount || !drawingSettings) return;
    (_boardRef$current = boardRef.current) === null || _boardRef$current === void 0 || _boardRef$current.setDrawingSettings(drawingSettings);
  }, [drawingSettings, boardRef.current, resizedCount]);
  const applyJSON = contentJSON => {
    if (!boardRef.current) return;
    let json = contentJSON;
    if (json) {
      if (typeof json === 'string') {
        json = JSON.parse(json);
      }
      if (json.backgroundImage) {
        delete json.backgroundImage;
      }
      boardRef.current.applyJSON(json);
    } else {
      boardRef.current.clearCanvas();
    }
    boardRef.current.canvas.requestRenderAll();
  };
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !canvasReady) return;
    applyJSON(contentJSON);
  }, [contentJSON, fileInfo.currentPage, canvasReady]);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount || !pageData.viewportTransform) return;
    setViewportTransform(pageData.viewportTransform);
    boardRef.current.canvas.setViewportTransform(pageData.viewportTransform);
  }, [pageData.viewportTransform, resizedCount]);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount || !pageData.zoom) return;
    setZoom(pageData.zoom);
    boardRef.current.canvas.setZoom(pageData.zoom);
  }, [pageData.zoom, resizedCount]);

  /**
   * Handles image upload process and error handling
   * @param {Promise} uploadPromise - Promise returned from boardRef.current upload methods
   * @param {Object} metadata - Additional data for callbacks
   * @param {Event} [metadata.event] - Original event if available
   * @param {File} metadata.file - The file being uploaded
   */
  const handleImageUpload = (uploadPromise, metadata) => {
    if (!boardRef.current) return;
    uploadPromise.catch(error => console.error('Error uploading image:', error));
  };
  const uploadImageFile = file => {
    if (!file) return;
    handleImageUpload(boardRef.current.processImageFile(file), {
      file: file
    });
  };
  const timerViewportChangeId = (0, _react.useRef)(null);
  const addListeners = canvas => {
    canvas.on('after:render', e => {
      onCanvasRender(e, canvas);
    });
    canvas.on('viewport:change', function (data) {
      if (!data.viewportTransform) return;
      timerViewportChangeId.current = setTimeout(() => {
        var _data$viewportTransfo, _data$viewportTransfo2;
        if (!boardRef.current || !data.viewportTransform) return;
        setViewportTransform([...data.viewportTransform]);
        setZoom((_data$viewportTransfo = data.viewportTransform) === null || _data$viewportTransfo === void 0 ? void 0 : _data$viewportTransfo[0]);
        onZoom(data, null, canvas);
        onConfigChange(_objectSpread(_objectSpread({}, pageData), {}, {
          zoom: (_data$viewportTransfo2 = data.viewportTransform) === null || _data$viewportTransfo2 === void 0 ? void 0 : _data$viewportTransfo2[0],
          viewportTransform: [...data.viewportTransform]
        }), null, canvas);
      }, 100);
    });
    canvas.on('zoom:change', function (data) {
      onZoom(data, null, canvas);
      setViewportTransform(canvas.viewportTransform);
      setZoom(data.scale);
    });
    canvas.on('object:added', event => {
      const json = event.target.toJSON();
      onObjectAdded(json, event, canvas);
      onCanvasChange(json, event, canvas);
      handleSaveCanvasState(json);
    });
    canvas.on('object:removed', event => {
      const json = event.target.toJSON();
      onObjectRemoved(json, event, canvas);
      handleSaveCanvasState(json);
      onCanvasChange(json, event, canvas);
    });
    canvas.on('object:modified', event => {
      const json = event.target.toJSON();
      onObjectModified(json, event, canvas);
      handleSaveCanvasState(json);
      onCanvasChange(json, event, canvas);
    });
    canvas.on('canvas:resized', event => {
      setResizedCount(p => p + 1);
    });
    canvas.on('canvas:ready', event => {
      setCanvasReady(true);
    });
  };
  const handleSaveCanvasState = content => {
    setCanvasSaveData(prevStates => [...prevStates, content].slice(-20));
  };
  const handleLoadCanvasState = state => {
    if (boardRef.current && state) {
      boardRef.current.canvas.loadFromJSON(state, () => {
        boardRef.current.canvas.requestRenderAll();
      });
    }
  };
  const changeBrushWidth = e => {
    const intValue = parseInt(e.target.value);
    boardRef.current.canvas.freeDrawingBrush.width = intValue;
    const newOptions = _objectSpread(_objectSpread({}, drawingSettings), {}, {
      brushWidth: intValue
    });
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const changeMode = (mode, e) => {
    if (drawingSettings.currentMode === mode) return;
    const newOptions = _objectSpread(_objectSpread({}, drawingSettings), {}, {
      currentMode: mode
    });
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const changeCurrentColor = (color, e) => {
    boardRef.current.canvas.freeDrawingBrush.color = color;
    const newOptions = _objectSpread(_objectSpread({}, drawingSettings), {}, {
      currentColor: color
    });
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const changeFill = e => {
    const newOptions = _objectSpread(_objectSpread({}, drawingSettings), {}, {
      fill: !drawingSettings.fill
    });
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const handleSaveCanvasAsImage = () => {
    canvasRef.current.toBlob(function (blob) {
      (0, _fileSaver.saveAs)(blob, "".concat(fileInfo.fileName, "-").concat(fileInfo.currentPageNumber ? '_page-' : '', ".png"));
      onSaveCanvasAsImage(blob, null, boardRef.current.canvas);
    });
  };
  const bringControlTOStartPosition = () => {
    boardRef.current.canvas.viewportTransform = [1, 0, 0, 1, 50, 130];
    boardRef.current.resetZoom(1);
    boardRef.current.nowX = 0;
    boardRef.current.nowY = 0;
  };
  const onImageChange = event => {
    var _event$target, _file$type;
    const file = (_event$target = event.target) === null || _event$target === void 0 || (_event$target = _event$target.files) === null || _event$target === void 0 ? void 0 : _event$target[0];
    if (file !== null && file !== void 0 && (_file$type = file.type) !== null && _file$type !== void 0 && _file$type.includes('image/')) {
      uploadImageFile(file);
      onImageUploaded(file, event, boardRef.current.canvas);
    }
  };
  const onPFDChange = event => {
    var _event$target2, _file$type2;
    const file = (_event$target2 = event.target) === null || _event$target2 === void 0 || (_event$target2 = _event$target2.files) === null || _event$target2 === void 0 ? void 0 : _event$target2[0];
    if (file !== null && file !== void 0 && (_file$type2 = file.type) !== null && _file$type2 !== void 0 && _file$type2.includes('pdf')) {
      // Pass to parent component to handle document addition
      onFileAdded(file);
      onPDFUploaded(file, event, boardRef.current.canvas);
    }
  };
  const fileChanger = file => {
    if (file.type.includes('image/')) {
      uploadImageFile(file);
    } else if (file.type.includes('pdf')) {
      // Pass to parent component to handle document addition
      onFileAdded(file);
    }
  };
  const updateFileInfo = data => {
    if (!data) return;
    onPageChange && onPageChange(data);
  };
  const handleZoomIn = () => {
    boardRef.current.changeZoom({
      scale: 1.1
    });
  };
  const handleZoomOut = () => {
    boardRef.current.changeZoom({
      scale: 0.9
    });
  };
  const handleResetZoom = () => {
    boardRef.current.resetZoom(1);
  };
  const getColorButtons = colors => {
    return colors.map(color => /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, {
      key: color
    }, /*#__PURE__*/_react.default.createElement(_Whiteboard.ColorButtonS, {
      color: color,
      onClick: e => changeCurrentColor(color, e)
    })));
  };
  const getControls = () => {
    const modeButtons = {
      [_Board.modes.SELECT]: {
        icon: _cursor.default,
        name: 'Select'
      },
      [_Board.modes.PENCIL]: {
        icon: _pencilEdit.default,
        name: 'Pencil'
      },
      [_Board.modes.LINE]: {
        icon: _line.default,
        name: 'Line'
      },
      [_Board.modes.RECTANGLE]: {
        icon: _rectangle.default,
        name: 'Rectangle'
      },
      [_Board.modes.ELLIPSE]: {
        icon: _ellipse.default,
        name: 'Ellipse'
      },
      [_Board.modes.TRIANGLE]: {
        icon: _triangle.default,
        name: 'Triangle'
      },
      [_Board.modes.TEXT]: {
        icon: _text.default,
        name: 'Text'
      },
      [_Board.modes.ERASER]: {
        icon: _eraserIcon.default,
        name: 'Eraser'
      }
    };
    return Object.keys(modeButtons).map(buttonKey => {
      if (!enabledControls[buttonKey]) return;
      const btn = modeButtons[buttonKey];
      return /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
        key: buttonKey,
        type: "button",
        className: "".concat(drawingSettings.currentMode === buttonKey ? 'selected' : ''),
        onClick: e => changeMode(buttonKey, e)
      }, /*#__PURE__*/_react.default.createElement("img", {
        style: {
          width: '22px',
          height: '22px'
        },
        src: btn.icon,
        alt: btn.name
      }));
    });
  };
  return /*#__PURE__*/_react.default.createElement(_Whiteboard.WhiteBoardS, {
    ref: whiteboardRef,
    style: style
  }, /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarHolderS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ColorBarS, null, !!enabledControls.COLOR_PICKER && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_ColorPicker.ColorPicker, {
    size: 28,
    color: drawingSettings.currentColor,
    onChange: color => changeCurrentColor(color, null)
  })), !!enabledControls.BRUSH && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.RangeInputS, {
    type: "range",
    min: 1,
    max: 30,
    step: 1,
    style: {
      '--thumb-color': drawingSettings.currentColor
    },
    value: drawingSettings.brushWidth,
    onChange: changeBrushWidth
  })), !!enabledControls.DEFAULT_COLORS && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, getColorButtons(['#6161ff', '#ff4f4f', '#3fd18d', '#ec70ff', '#000000'])), !!enabledControls.FILL && /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    type: "button",
    className: drawingSettings.fill ? 'selected' : '',
    onClick: changeFill
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _colorFill.default,
    alt: "Delete"
  }))), /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarS, null, getControls(), !!enabledControls.GO_TO_START && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: bringControlTOStartPosition
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _centerFocus.default,
    alt: "Recenter"
  }))), !!enabledControls.CLEAR && /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    type: "button",
    onClick: () => boardRef.current.clearCanvas()
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _delete.default,
    alt: "Delete"
  })), /*#__PURE__*/_react.default.createElement(_Whiteboard.SeparatorS, null), !!enabledControls.FILES && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadImageRef,
    hidden: true,
    accept: "image/*",
    type: "file",
    onChange: onImageChange
  }), /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: () => uploadImageRef.current.click()
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _addPhoto.default,
    alt: "Delete"
  }))), !!enabledControls.FILES && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadPdfRef,
    hidden: true,
    accept: ".pdf",
    type: "file",
    onChange: onPFDChange
  }), /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: () => uploadPdfRef.current.click()
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _pdfFile.default,
    alt: "Delete"
  }))), !!enabledControls.SAVE_AS_IMAGE && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleSaveCanvasAsImage
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _download.default,
    alt: "Download"
  }))), !!enabledControls.SAVE_AND_LOAD && canvasSaveData && canvasSaveData.length > 0 && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: () => handleLoadCanvasState(canvasSaveData[0])
  }, "Load"))), /*#__PURE__*/_react.default.createElement(_Whiteboard.ZoomBarS, null, !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleZoomIn,
    title: "Zoom In"
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _zoomIn.default,
    alt: "Zoom In"
  }))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleResetZoom,
    title: "Reset Zoom"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '11px'
    }
  }, Math.floor(zoom * 100), "%"))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleZoomOut,
    title: "Zoom Out"
  }, /*#__PURE__*/_react.default.createElement("img", {
    style: {
      width: '22px',
      height: '22px'
    },
    src: _zoomOut.default,
    alt: "Zoom Out"
  }))))), /*#__PURE__*/_react.default.createElement(_Whiteboard.BoardWrapperS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.PDFWrapperS, null, /*#__PURE__*/_react.default.createElement(_index.PdfReader, {
    fileReaderInfo: fileInfo,
    viewportTransform: viewportTransform,
    file: documents.get(activeTabIndex)
    //onPageChange={handlePageChange}
    ,
    updateFileReaderInfo: updateFileInfo
  })), /*#__PURE__*/_react.default.createElement("canvas", {
    style: {
      backgroundColor: 'transparent',
      zIndex: 1,
      width: '100%',
      height: '100%',
      position: 'absolute',
      right: 0,
      bottom: 0,
      top: 0,
      left: 0,
      overflow: 'hidden'
    },
    className: "canvas",
    ref: canvasRef,
    id: "canvas"
  })));
};
var _default = exports.default = WhiteboardCore;