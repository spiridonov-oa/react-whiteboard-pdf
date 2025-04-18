"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("react-pdf/dist/esm/Page/TextLayer.css");
require("react-pdf/dist/esm/Page/AnnotationLayer.css");
var _Whiteboard = require("./Whiteboard.styled");
var _index = require("../PdfReader/index");
var _fileSaver = require("file-saver");
var _Board = require("../Board/Board.Class");
var _ColorPicker = require("../ColorPicker");
var _cursor = _interopRequireDefault(require("./../images/cursor.svg"));
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Add these two imports for react-pdf text layer support

const fn = () => {};
const defaultFunction = (data, event, canvas) => {};
const WhiteboardCore = _ref => {
  let {
    controls,
    activeTabState,
    activeTabIndex,
    fileInfo,
    contentJSON,
    drawingSettings,
    canvasRefLink,
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
  // const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const canvasSettings = pageData;
  const [zoom, setZoom] = (0, _react.useState)(canvasSettings.zoom);
  const canvasRef = (0, _react.useRef)(null);
  const whiteboardRef = (0, _react.useRef)(null);
  const uploadPdfRef = (0, _react.useRef)(null);
  const enabledControls = (0, _react.useMemo)(function () {
    return {
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
      SAVE_AS_IMAGE: true,
      GO_TO_START: true,
      SAVE_AND_LOAD: true,
      ZOOM: true,
      TABS: true,
      ...controls
    };
  }, [controls]);
  const applyJSON = () => {
    if (!boardRef.current) return;
    let json = contentJSON;
    if (json) {
      if (typeof json === 'string') {
        json = JSON.parse(json);
      }
      boardRef.current.applyJSON(json);
    } else {
      boardRef.current.clearCanvas();
    }
    boardRef.current.canvas.requestRenderAll();
  };
  (0, _react.useEffect)(() => {
    if (imageSlot) {
      fileChanger(imageSlot);
    }
  }, [imageSlot]);
  (0, _react.useEffect)(() => {
    if (!canvasRef.current) return;
    const newBoard = new _Board.Board({
      drawingSettings: drawingSettings,
      canvasConfig: canvasSettings,
      canvasRef: canvasRef
    });
    canvasRefLink.canvas = newBoard.canvas;
    boardRef.current = newBoard;
    boardRef.current.setCanvasConfig(canvasSettings);
    addListeners(newBoard.canvas);
    return () => {
      if (newBoard) {
        newBoard.removeBoard();
      }
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount) return;
    boardRef.current.setCanvasConfig(canvasSettings);
    onConfigChange(canvasSettings, null, boardRef.current.canvas);
  }, [canvasSettings, resizedCount]);
  (0, _react.useEffect)(() => {
    var _boardRef$current;
    if (!boardRef.current || !resizedCount || !drawingSettings) return;
    (_boardRef$current = boardRef.current) === null || _boardRef$current === void 0 || _boardRef$current.setDrawingSettings(drawingSettings);
  }, [drawingSettings, boardRef.current, resizedCount]);
  const openPageTimer = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount) return;
    if (fileInfo.currentPage) {
      if (openPageTimer.current) {
        clearTimeout(openPageTimer.current);
      }
      openPageTimer.current = setTimeout(() => {
        if (!boardRef.current) return;
        boardRef.current.openPage(fileInfo.currentPage);
        boardRef.current.canvas.requestRenderAll();
      }, 100);
    }
  }, [fileInfo.fileName, fileInfo.currentPage, resizedCount]);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount || !pageData.viewportTransform) return;
    boardRef.current.canvas.setViewportTransform(pageData.viewportTransform);
  }, [pageData.viewportTransform, resizedCount]);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount || !pageData.zoom) return;
    boardRef.current.canvas.setZoom(pageData.zoom);
  }, [pageData.zoom, resizedCount]);
  (0, _react.useEffect)(() => {
    if (!boardRef.current || !resizedCount) return;
    applyJSON();
  }, [contentJSON, resizedCount]);

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
  const addListeners = canvas => {
    canvas.on('after:render', e => {
      onCanvasRender(e, canvas);
    });
    canvas.on('zoom:change', function (data) {
      onZoom(data, null, canvas);
      setZoom(data.scale);
    });
    canvas.on('object:added', event => {
      onObjectAdded(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });
    canvas.on('object:removed', event => {
      onObjectRemoved(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });
    canvas.on('object:modified', event => {
      onObjectModified(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });
    canvas.on('canvas:resized', event => {
      setResizedCount(p => p + 1);
    });
  };
  const handleSaveCanvasState = () => {
    const newCanvasState = boardRef.current.canvas.toJSON();
    setCanvasSaveData(prevStates => [...prevStates, newCanvasState]);
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
    const newOptions = {
      ...drawingSettings,
      brushWidth: intValue
    };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const changeMode = (mode, e) => {
    if (drawingSettings.currentMode === mode) return;
    const newOptions = {
      ...drawingSettings,
      currentMode: mode
    };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const changeCurrentColor = (color, e) => {
    boardRef.current.canvas.freeDrawingBrush.color = color;
    const newOptions = {
      ...drawingSettings,
      currentColor: color
    };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const changeFill = e => {
    const newOptions = {
      ...drawingSettings,
      fill: !drawingSettings.fill
    };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };
  const handleSaveCanvasAsImage = () => {
    canvasRef.current.toBlob(function (blob) {
      (0, _fileSaver.saveAs)(blob, `${fileInfo.fileName}-${fileInfo.currentPageNumber ? '_page-' : ''}.png`);
      onSaveCanvasAsImage(blob, null, boardRef.current.canvas);
    });
  };
  const bringControlTOStartPosition = () => {
    boardRef.current.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    boardRef.current.resetZoom(1);
    boardRef.current.nowX = 0;
    boardRef.current.nowY = 0;
  };
  const onFileChange = event => {
    var _event$target;
    const file = (_event$target = event.target) === null || _event$target === void 0 || (_event$target = _event$target.files) === null || _event$target === void 0 ? void 0 : _event$target[0];
    if (!file) return;
    if (file.type.includes('image/')) {
      uploadImageFile(file);
      onImageUploaded(file, event, boardRef.current.canvas);
    } else if (file.type.includes('pdf')) {
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
        icon: _pencil.default,
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
        icon: _eraser.default,
        name: 'Eraser'
      }
    };
    return Object.keys(modeButtons).map(buttonKey => {
      if (!enabledControls[buttonKey]) return;
      const btn = modeButtons[buttonKey];
      return /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
        key: buttonKey,
        type: "button",
        className: `${drawingSettings.currentMode === buttonKey ? 'selected' : ''}`,
        onClick: e => changeMode(buttonKey, e)
      }, /*#__PURE__*/_react.default.createElement("img", {
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
    src: _colorFill.default,
    alt: "Delete"
  }))), /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarS, null, getControls(), !!enabledControls.CLEAR && /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    type: "button",
    onClick: () => boardRef.current.clearCanvas()
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
    onClick: () => uploadPdfRef.current.click()
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _addPhoto.default,
    alt: "Delete"
  }))), !!enabledControls.SAVE_AS_IMAGE && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleSaveCanvasAsImage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _download.default,
    alt: "Download"
  }))), !!enabledControls.GO_TO_START && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: bringControlTOStartPosition
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _focus.default,
    alt: "Recenter"
  }))), !!enabledControls.SAVE_AND_LOAD && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    type: "button",
    onClick: handleSaveCanvasState
  }, "Save")), !!enabledControls.SAVE_AND_LOAD && canvasSaveData && canvasSaveData.length > 0 && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: () => handleLoadCanvasState(canvasSaveData[0])
  }, "Load"))), /*#__PURE__*/_react.default.createElement(_Whiteboard.ZoomBarS, null, !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
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
  }, Math.floor(zoom * 100), "%"))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_Whiteboard.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_Whiteboard.ButtonS, {
    onClick: handleZoomOut,
    title: "Zoom Out"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _zoomOut.default,
    alt: "Zoom Out"
  }))))), /*#__PURE__*/_react.default.createElement(_Whiteboard.PDFWrapperS, null, /*#__PURE__*/_react.default.createElement(_index.PdfReader, {
    fileReaderInfo: fileInfo
    //onPageChange={handlePageChange}
    ,
    updateFileReaderInfo: updateFileInfo
  })), /*#__PURE__*/_react.default.createElement("canvas", {
    style: {
      zIndex: 1,
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0
    },
    className: "canvas",
    ref: canvasRef,
    id: "canvas"
  }));
};
var _default = exports.default = WhiteboardCore;