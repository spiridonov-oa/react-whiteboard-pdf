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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const initFileInfo = {
  file: {
    name: 'Whiteboard'
  },
  totalPages: 1,
  currentPageNumber: 1,
  currentPage: ''
};
const initDrawingSettings = {
  brushWidth: 5,
  currentMode: 'PENCIL',
  currentColor: '#000000',
  brushWidth: 5,
  fill: false
  // background: true,
};
const initSettings = {
  zoom: 1,
  contentJSON: null
};
const defaultFunction = (data, event, canvas) => {};
const Whiteboard = _ref => {
  var _fileReaderInfo$file, _fileReaderInfo$file2;
  let {
    controls,
    settings,
    drawingSettings,
    fileInfo,
    onObjectAdded = defaultFunction,
    onObjectRemoved = defaultFunction,
    onObjectModified = defaultFunction,
    onCanvasRender = defaultFunction,
    onCanvasChange = defaultFunction,
    onZoom = defaultFunction,
    onImageUploaded = defaultFunction,
    onPDFUploaded = defaultFunction,
    onPDFUpdated = defaultFunction,
    onPageChange = defaultFunction,
    onOptionsChange = defaultFunction,
    onSaveCanvasAsImage = defaultFunction,
    onConfigChange = defaultFunction,
    onSaveCanvasState = defaultFunction,
    onDocumentChanged = defaultFunction
  } = _ref;
  const [canvasSaveData, setCanvasSaveData] = (0, _react.useState)([]);
  const [board, setBoard] = (0, _react.useState)();
  const [canvasObjectsPerPage, setCanvasObjectsPerPage] = (0, _react.useState)({});
  const [canvasDrawingSettings, setCanvasDrawingSettings] = (0, _react.useState)({
    ...initDrawingSettings,
    ...drawingSettings
  });
  const canvasConfig = {
    ...initSettings,
    ...settings
  };
  const [documents, setDocuments] = (0, _react.useState)(new Map().set(initFileInfo.file.name, initFileInfo.file));
  const [zoom, setZoom] = (0, _react.useState)(canvasConfig.zoom);
  const [fileReaderInfo, setFileReaderInfo] = (0, _react.useState)({
    ...initFileInfo,
    ...fileInfo
  });
  const canvasRef = (0, _react.useRef)(null);
  const whiteboardRef = (0, _react.useRef)(null);
  const uploadPdfRef = (0, _react.useRef)(null);
  const enabledControls = (0, _react.useMemo)(function () {
    return {
      [_BoardClass.modes.PENCIL]: true,
      [_BoardClass.modes.LINE]: true,
      [_BoardClass.modes.RECTANGLE]: true,
      [_BoardClass.modes.ELLIPSE]: true,
      [_BoardClass.modes.TRIANGLE]: true,
      [_BoardClass.modes.TEXT]: true,
      [_BoardClass.modes.SELECT]: true,
      [_BoardClass.modes.ERASER]: true,
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
  (0, _react.useEffect)(() => {
    setCanvasDrawingSettings({
      ...canvasDrawingSettings,
      ...drawingSettings
    });
  }, [drawingSettings]);
  (0, _react.useEffect)(() => {
    if (!board || !canvasConfig) return;
    board.setCanvasConfig(canvasConfig);
  }, [settings]);
  (0, _react.useEffect)(() => {
    setFileReaderInfo({
      ...fileReaderInfo,
      ...fileInfo
    });
  }, [fileInfo]);
  (0, _react.useEffect)(() => {
    if (board) {
      return;
    }
    const newBoard = new _BoardClass.Board({
      drawingSettings: canvasDrawingSettings,
      canvasConfig: canvasConfig,
      canvasRef: canvasRef // Sketch range limits
    });
    setBoard(newBoard);
    addListeners(newBoard.canvas);
    return () => {
      if (board) {
        board.removeBoard();
      }
    };
  }, [board]);
  (0, _react.useEffect)(() => {
    if (!board || !canvasDrawingSettings) return;
    board.setDrawingSettings(canvasDrawingSettings);
  }, [canvasDrawingSettings, board]);

  // useEffect(() => {
  //   if (!board || !canvasConfig) return;

  //   board.setCanvasConfig(canvasConfig);
  //   onConfigChange(canvasConfig, null, board.canvas);
  // }, [board, canvasConfig]);

  (0, _react.useEffect)(() => {
    if (!(board != null && board.canvas)) {
      return;
    }
    const json = getPageJSON({
      fileName: fileReaderInfo.file.name,
      pageNumber: fileReaderInfo.currentPageNumber
    });
    if (json) {
      board.canvas.loadFromJSON(json);
    } else {
      board.openPage(fileReaderInfo.currentPage);
    }
  }, [fileReaderInfo == null || (_fileReaderInfo$file = fileReaderInfo.file) == null ? void 0 : _fileReaderInfo$file.name, fileReaderInfo.currentPage]);
  function uploadImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.addEventListener('load', () => {
      _fabric.fabric.Image.fromURL(reader.result, img => {
        img.scaleToHeight(board.canvas.height);
        board.canvas.add(img);
      });
    });
    reader.readAsDataURL(file);
  }
  function addListeners(canvas) {
    canvas.on('after:render', e => {
      const data = getFullData(canvas);
      onCanvasRender(data, e, canvas);
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
  }
  function handleSaveCanvasState() {
    const newCanvasState = board.canvas.toJSON();
    setCanvasSaveData(prevStates => [...prevStates, newCanvasState]);
  }
  function handleLoadCanvasState(state) {
    if (board && state) {
      board.canvas.loadFromJSON(state, () => {
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
    const newValue = {
      ...canvasObjectsPerPage,
      [fileReaderInfo.file.name]: {
        ...canvasObjectsPerPage[fileReaderInfo.file.name],
        [fileReaderInfo.currentPageNumber]: board.canvas.toJSON()
      }
    };
    setCanvasObjectsPerPage(newValue);
    console.log({
      newValue
    });
    onSaveCanvasState(newValue);
  }
  function changeBrushWidth(e) {
    const intValue = parseInt(e.target.value);
    board.canvas.freeDrawingBrush.width = intValue;
    const newOptions = {
      ...canvasDrawingSettings,
      brushWidth: intValue
    };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }
  function changeMode(mode, e) {
    if (canvasDrawingSettings.currentMode === mode) return;
    const newOptions = {
      ...canvasDrawingSettings,
      currentMode: mode
    };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }
  function changeCurrentColor(color, e) {
    board.canvas.freeDrawingBrush.color = color;
    const newOptions = {
      ...canvasDrawingSettings,
      currentColor: color
    };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }
  function changeFill(e) {
    const newOptions = {
      ...canvasDrawingSettings,
      fill: !canvasDrawingSettings.fill
    };
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
    var _event$target;
    const file = (_event$target = event.target) == null || (_event$target = _event$target.files) == null ? void 0 : _event$target[0];
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
      setDocuments(prev => new Map(prev.set(file.name, file)));
      onPDFUploaded(file, event, board.canvas);
    }
  }
  function getPageJSON(_ref2) {
    let {
      fileName,
      pageNumber
    } = _ref2;
    if (canvasObjectsPerPage[fileName] && canvasObjectsPerPage[fileName][pageNumber]) {
      return canvasObjectsPerPage[fileName][pageNumber];
    } else {
      return null;
    }
  }
  function updateFileReaderInfo(data) {
    const newFileData = {
      ...fileReaderInfo,
      ...data
    };
    setFileReaderInfo(newFileData);
    onPDFUpdated(newFileData, null, board.canvas);
  }
  const handlePageChange = page => {
    saveCanvasState();
    board.clearCanvas(board.canvas);
    setFileReaderInfo({
      ...fileReaderInfo,
      currentPageNumber: page
    });
    onPageChange({
      ...fileReaderInfo,
      currentPageNumber: page
    }, null, board.canvas);
  };
  const changeDocument = name => {
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
  const handleZoomIn = () => {
    board.changeZoom({
      scale: 1.1
    });
  };
  const handleZoomOut = () => {
    board.changeZoom({
      scale: 0.9
    });
  };
  const handleResetZoom = () => {
    board.resetZoom(1);
  };
  const getColorButtons = colors => {
    return colors.map(color => /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ToolbarItemS, {
      key: color
    }, /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ColorButtonS, {
      color: color,
      onClick: e => changeCurrentColor(color, e)
    })));
  };
  const getControls = () => {
    const modeButtons = {
      [_BoardClass.modes.PENCIL]: {
        icon: _pencil.default,
        name: 'Pencil'
      },
      [_BoardClass.modes.LINE]: {
        icon: _line.default,
        name: 'Line'
      },
      [_BoardClass.modes.RECTANGLE]: {
        icon: _rectangle.default,
        name: 'Rectangle'
      },
      [_BoardClass.modes.ELLIPSE]: {
        icon: _ellipse.default,
        name: 'Ellipse'
      },
      [_BoardClass.modes.TRIANGLE]: {
        icon: _triangle.default,
        name: 'Triangle'
      },
      [_BoardClass.modes.TEXT]: {
        icon: _text.default,
        name: 'Text'
      },
      [_BoardClass.modes.SELECT]: {
        icon: _cross.default,
        name: 'Select'
      },
      [_BoardClass.modes.ERASER]: {
        icon: _eraser.default,
        name: 'Eraser'
      }
    };
    return Object.keys(modeButtons).map(buttonKey => {
      if (!enabledControls[buttonKey]) return;
      const btn = modeButtons[buttonKey];
      return /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.ButtonS, {
        key: buttonKey,
        type: "button",
        className: "" + (canvasDrawingSettings.currentMode === buttonKey ? 'selected' : ''),
        onClick: e => changeMode(buttonKey, e)
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: btn.icon,
        alt: btn.name
      }));
    });
  };
  return /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.WrapperS, null, !!enabledControls.TABS && /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.TabsS, null, Array.from(documents.keys()).map((document, index) => /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.TabS, {
    key: index // Using index as a key if document is not unique
    ,
    onClick: () => changeDocument(document),
    style: document === fileReaderInfo.file.name ? {
      backgroundColor: 'rgba(0,0,0,0.1)'
    } : {}
  }, document))), /*#__PURE__*/_react.default.createElement(_WhiteboardStyled.WhiteBoardS, {
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
    onClick: () => board.clearCanvas()
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
    onClick: () => uploadPdfRef.current.click()
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
    onClick: () => handleLoadCanvasState(canvasSaveData[0])
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
var _default = exports.default = Whiteboard;