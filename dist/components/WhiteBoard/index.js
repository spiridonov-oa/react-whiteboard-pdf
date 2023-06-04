"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _WhiteBoardStyled = require("./WhiteBoard.styled.js");

var _fabric = require("fabric");

var _PdfReader = _interopRequireDefault(require("../PdfReader"));

var _fileSaver = require("file-saver");

var _BoardClass = require("./Board.Class.js");

var _cursors = require("./cursors");

var _ColorPicker = require("./../ColorPicker");

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var drawInstance = null;
var origX;
var origY;
var mouseDown = false;
var cursorPencil = (0, _cursors.getCursor)('pencil');
var modes = {
  PENCIL: 'PENCIL',
  LINE: 'LINE',
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  ERASER: 'ERASER',
  SELECT: 'SELECT',
  TEXT: 'TEXT'
};

var setDrawingMode = function setDrawingMode(canvas, options) {
  resetCanvas(canvas);

  switch (options.currentMode) {
    case modes.PENCIL:
      draw(canvas, options);
      break;

    case modes.LINE:
      createLine(canvas, options);
      break;

    case modes.RECTANGLE:
      createRect(canvas, options);
      break;

    case modes.ELLIPSE:
      createEllipse(canvas, options);
      break;

    case modes.TRIANGLE:
      createTriangle(canvas, options);
      break;

    case modes.ERASER:
      eraserOn(canvas, options);
      break;

    case modes.SELECT:
      onSelectMode(canvas, options);
      break;

    case modes.TEXT:
      createText(canvas, options);
      break;

    default:
      draw(canvas, options);
  }
};

function resetCanvas(canvas) {
  removeCanvasListener(canvas);
  canvas.isDrawingMode = false;
  canvas.defaultCursor = 'auto';
  canvas.hoverCursor = 'auto';
} // function drawBackground(canvas) {
//   const dotSize = 4; // Adjust the size of the dots as needed
//   const dotSvg = `
//       <svg xmlns="http://www.w3.org/2000/svg" width="${dotSize * 10}" height="${
//     dotSize * 10
//   }" viewBox="0 0 ${dotSize * 10} ${dotSize * 10}">
//         <circle cx="${dotSize / 2}" cy="${dotSize / 2}" r="${dotSize / 2}" fill="#00000010" />
//       </svg>
//     `;
//   let rect;
//   return new Promise((resolve) => {
//     const dotImage = new Image();
//     dotImage.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(dotSvg);
//     dotImage.onload = function () {
//       const dotPattern = new fabric.Pattern({
//         source: dotImage,
//         repeat: 'repeat', // Adjust the repeat property to change the pattern repetition
//       });
//       const width = canvas.getWidth();
//       const height = canvas.getHeight();
//       const rect = new fabric.Rect({
//         itemId: 'background-id-rectangle',
//         width: width,
//         height: height,
//         fill: dotPattern,
//         selectable: false, // Prevent the dot from being selected
//         evented: false, // Prevent the dot from receiving events
//         lockMovementX: true, // Prevent horizontal movement of the dot
//         lockMovementY: true, // Prevent vertical movement of the dot
//       });
//       canvas.add(rect);
//       resolve(rect);
//     };
//   });
// }


function stopDrawing() {
  mouseDown = false;
}

function removeCanvasListener(canvas) {
  canvas.off('mouse:down');
  canvas.off('mouse:move');
  canvas.off('mouse:up');
  canvas.off('mouse:over');
}
/*  ==== line  ==== */


function createLine(canvas, options) {
  canvas.isDrawingMode = true;
  canvas.on('mouse:down', startAddLine(canvas, options));
  canvas.on('mouse:move', startDrawingLine(canvas));
  canvas.on('mouse:up', stopDrawing);
  canvas.selection = false;
  canvas.defaultCursor = cursorPencil;
  canvas.hoverCursor = cursorPencil;
  canvas.isDrawingMode = false;
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: false
    });
  });
  canvas.discardActiveObject().requestRenderAll();
}

function startAddLine(canvas, options) {
  return function (_ref) {
    var e = _ref.e;
    mouseDown = true;
    var pointer = canvas.getPointer(e);
    drawInstance = new _fabric.fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: options.brushWidth,
      stroke: options.currentColor,
      selectable: false,
      perPixelTargetFind: true
    });
    canvas.add(drawInstance);
    canvas.requestRenderAll();
  };
}

function startDrawingLine(canvas) {
  return function (_ref2) {
    var e = _ref2.e;

    if (mouseDown) {
      var pointer = canvas.getPointer(e);
      drawInstance.set({
        x2: pointer.x,
        y2: pointer.y
      });
      drawInstance.setCoords();
      canvas.requestRenderAll();
    }
  };
}
/* ==== rectangle ==== */


function createRect(canvas, options) {
  canvas.isDrawingMode = true;
  canvas.on('mouse:down', startAddRect(canvas, options));
  canvas.on('mouse:move', startDrawingRect(canvas));
  canvas.on('mouse:up', stopDrawing);
  canvas.selection = false;
  canvas.defaultCursor = cursorPencil;
  canvas.hoverCursor = cursorPencil;
  canvas.isDrawingMode = false;
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: false
    });
  });
  canvas.discardActiveObject().requestRenderAll();
}

function startAddRect(canvas, options) {
  return function (_ref3) {
    var e = _ref3.e;
    mouseDown = true;
    var pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Rect({
      stroke: options.currentColor,
      strokeWidth: options.brushWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
      perPixelTargetFind: true
    });
    canvas.add(drawInstance);
    drawInstance.on('mousedown', function (e) {
      if (options.currentMode === modes.ERASER) {
        canvas.remove(e.target);
      }
    });
  };
}

function startDrawingRect(canvas) {
  return function (_ref4) {
    var e = _ref4.e;

    if (mouseDown) {
      var pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }

      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }

      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY)
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}
/* ==== Ellipse ==== */


function createEllipse(canvas, options) {
  canvas.isDrawingMode = true;
  canvas.on('mouse:down', startAddEllipse(canvas, options));
  canvas.on('mouse:move', startDrawingEllipse(canvas));
  canvas.on('mouse:up', stopDrawing);
  canvas.selection = false;
  canvas.defaultCursor = cursorPencil;
  canvas.hoverCursor = cursorPencil;
  canvas.isDrawingMode = false;
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: false
    });
  });
  canvas.discardActiveObject().requestRenderAll();
}

function startAddEllipse(canvas, options) {
  return function (_ref5) {
    var e = _ref5.e;
    mouseDown = true;
    var pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Ellipse({
      stroke: options.currentColor,
      strokeWidth: options.brushWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      cornerSize: 7,
      objectCaching: false,
      selectable: false,
      perPixelTargetFind: true
    });
    canvas.add(drawInstance);
  };
}

function startDrawingEllipse(canvas) {
  return function (_ref6) {
    var e = _ref6.e;

    if (mouseDown) {
      var pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }

      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }

      drawInstance.set({
        rx: Math.abs(pointer.x - origX) / 2,
        ry: Math.abs(pointer.y - origY) / 2
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}
/* === triangle === */


function createTriangle(canvas, options) {
  canvas.isDrawingMode = true;
  canvas.on('mouse:down', startAddTriangle(canvas, options));
  canvas.on('mouse:move', startDrawingTriangle(canvas));
  canvas.on('mouse:up', stopDrawing);
  canvas.selection = false;
  canvas.defaultCursor = cursorPencil;
  canvas.hoverCursor = cursorPencil;
  canvas.isDrawingMode = false;
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: false
    });
  });
  canvas.discardActiveObject().requestRenderAll();
}

function startAddTriangle(canvas, options) {
  return function (_ref7) {
    var e = _ref7.e;
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;
    var pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Triangle({
      stroke: options.currentColor,
      strokeWidth: options.brushWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
      perPixelTargetFind: true
    });
    canvas.add(drawInstance);
  };
}

function startDrawingTriangle(canvas) {
  return function (_ref8) {
    var e = _ref8.e;

    if (mouseDown) {
      var pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }

      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }

      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY)
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

function createText(canvas, options) {
  canvas.isDrawingMode = true;
  canvas.on('mouse:down', addText(canvas, options));
  canvas.isDrawingMode = false;
}

function addText(canvas, options) {
  return function (_ref9) {
    var e = _ref9.e;
    var pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    var text = new _fabric.fabric.Textbox('', {
      left: origX - 10,
      top: origY - 10,
      fontSize: options.brushWidth * 5,
      fill: options.currentColor,
      editable: true,
      keysMap: {
        13: 'exitEditing'
      }
    });
    canvas.add(text);
    canvas.renderAll();
    text.enterEditing();
    canvas.off('mouse:down');
    canvas.on('mouse:down', function () {
      text.exitEditing();
      canvas.off('mouse:down');
      canvas.on('mouse:down', addText(canvas, options));
    });
  };
} // function changeToErasingMode(canvas, options) {
//   if (options.currentMode !== modes.ERASER) {
//     canvas.isDrawingMode = false;
//     options.currentMode = modes.ERASER;
//     canvas.hoverCursor = `url(${getCursor({ type: 'eraser' })}), default`;
//   }
// }


function onSelectMode(canvas, options) {
  options.currentMode = '';
  canvas.isDrawingMode = false;
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: true
    });
  });
  canvas.hoverCursor = 'all-scroll';
}

function clearCanvas(canvas, options) {
  canvas.getObjects().forEach(function (item) {
    if (item !== canvas.backgroundImage) {
      canvas.remove(item);
    } // if (options.background) {
    //   drawBackground(canvas);
    // }

  });
}

function eraserOn(canvas) {
  canvas.isDrawingMode = false;
  canvas.on('mouse:down', function (event) {
    canvas.remove(event.target);
    console.log('mouse:down');
    canvas.on('mouse:move', function (e) {
      console.log('mouse:move');
      canvas.remove(e.target);
    });
  });
  canvas.on('mouse:up', function () {
    canvas.off('mouse:move');
  });
  canvas.on('mouse:over', function (event) {
    var hoveredObject = event.target;

    if (hoveredObject) {
      hoveredObject.set({
        opacity: 0.2
      });
      canvas.requestRenderAll();
    }
  });
  canvas.on('mouse:out', function (event) {
    var hoveredObject = event.target;

    if (hoveredObject) {
      hoveredObject.set({
        opacity: 1
      });
      canvas.requestRenderAll();
    }
  });
  canvas.defaultCursor = (0, _cursors.getCursor)('eraser');
  canvas.hoverCursor = (0, _cursors.getCursor)('eraser');
}

function canvasToJson(canvas) {
  var obj = canvas.toJSON();
  console.log(JSON.stringify(obj));
  console.log(encodeURI(JSON.stringify(obj)).split(/%..|./).length - 1);
  alert(JSON.stringify(obj));
}

function draw(canvas, options) {
  canvas.freeDrawingBrush = new _fabric.fabric.PencilBrush(canvas, {
    perPixelTargetFind: true
  });
  canvas.freeDrawingBrush.width = options.brushWidth;
  canvas.freeDrawingBrush.color = options.currentColor;
  canvas.isDrawingMode = true;
  canvas.freeDrawingCursor = cursorPencil;
}

function throttle(f, delay) {
  var timer = 0;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timer);
    timer = setTimeout(function () {
      return f.apply(_this, args);
    }, delay);
  };
}

function handleResize(callback) {
  var resize_ob = new ResizeObserver(throttle(callback, 300));
  return resize_ob;
}

function resizeCanvas(canvas, whiteboard) {
  return function () {
    var width = whiteboard.clientWidth;
    var height = whiteboard.clientHeight; // const scale = width / canvas.getWidth();
    // const zoom = canvas.getZoom() * scale;

    canvas.setDimensions({
      width: width,
      height: height
    }); // canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}

var Whiteboard = function Whiteboard(_ref10) {
  var _ref11;

  var _ref10$options = _ref10.options,
      options = _ref10$options === void 0 ? (_ref11 = {
    brushWidth: 5,
    currentMode: modes.PENCIL,
    currentColor: '#000000'
  }, _ref11["brushWidth"] = 5, _ref11.fill = false, _ref11) : _ref10$options,
      _ref10$controls = _ref10.controls,
      controls = _ref10$controls === void 0 ? {} : _ref10$controls,
      _ref10$canvasJSON = _ref10.canvasJSON,
      canvasJSON = _ref10$canvasJSON === void 0 ? null : _ref10$canvasJSON,
      _ref10$onObjectAdded = _ref10.onObjectAdded,
      onObjectAdded = _ref10$onObjectAdded === void 0 ? function () {} : _ref10$onObjectAdded,
      _ref10$onObjectRemove = _ref10.onObjectRemoved,
      onObjectRemoved = _ref10$onObjectRemove === void 0 ? function () {} : _ref10$onObjectRemove;

  var _useState = (0, _react.useState)(null),
      canvas = _useState[0],
      setCanvas = _useState[1];

  var _useState2 = (0, _react.useState)({}),
      canvasObjectsPerPage = _useState2[0],
      setCanvasObjectsPerPage = _useState2[1];

  var _useState3 = (0, _react.useState)(options),
      canvasOptions = _useState3[0],
      setCanvasOptions = _useState3[1];

  var _useState4 = (0, _react.useState)({
    file: {
      name: 'Desk 1'
    },
    totalPages: 1,
    currentPageNumber: 0,
    currentPage: ''
  }),
      fileReaderInfo = _useState4[0],
      setFileReaderInfo = _useState4[1];

  var canvasRef = (0, _react.useRef)(null);
  var whiteboardRef = (0, _react.useRef)(null);
  var uploadPdfRef = (0, _react.useRef)(null);
  var enabledControls = (0, _react.useMemo)(function () {
    var _extends2;

    return _extends((_extends2 = {}, _extends2[modes.PENCIL] = true, _extends2[modes.LINE] = true, _extends2[modes.RECTANGLE] = true, _extends2[modes.ELLIPSE] = true, _extends2[modes.TRIANGLE] = true, _extends2[modes.TEXT] = true, _extends2[modes.SELECT] = true, _extends2[modes.ERASER] = true, _extends2.CLEAR = true, _extends2.FILL = true, _extends2.BRUSH = true, _extends2.COLOR = true, _extends2.FILES = true, _extends2.TO_JSON = true, _extends2.SAVE_AS_IMAGE = true, _extends2.ZOOM = true, _extends2), controls);
  }, [controls]);
  (0, _react.useEffect)(function () {
    var board = new _BoardClass.Board(_extends({
      width: whiteboardRef.current.clientWidth,
      height: whiteboardRef.current.clientHeight
    }, canvasOptions));
    setCanvas(board.canvas); // init mode

    setDrawingMode(board.canvas, canvasOptions);
    return function () {
      if (board.canvas) {
        board.canvas.dispose();
      }
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (!canvas || !canvasJSON) return;
    canvas.loadFromJSON(canvasJSON);
  }, [canvas, canvasJSON]); // useEffect(() => {
  //   if (!canvas || !options.background) return;
  //   const promiseBackground = drawBackground(canvas);
  //   return () => {
  //     promiseBackground.then((bg) => {
  //       canvas.remove(bg);
  //     });
  //   };
  // }, [canvas, options.background]);

  (0, _react.useEffect)(function () {
    if (!canvas || !whiteboardRef.current) return;
    var element = handleResize(resizeCanvas(canvas, whiteboardRef.current));
    element.observe(whiteboardRef.current);
    return function () {
      element.disconnect();
    };
  }, [canvas, whiteboardRef.current]);
  (0, _react.useEffect)(function () {
    if (!canvas) return; // {
    //   const deltaY = opt.e.deltaY;
    //   const deltaX = opt.e.deltaX;
    //   const isVerticalScroll = Math.abs(deltaY) > Math.abs(deltaX);
    //   const isCanvasLargerThanViewport =
    //     canvas.width > canvas.viewportTransform[4] || canvas.height > canvas.viewportTransform[5];
    //   if (isVerticalScroll && isCanvasLargerThanViewport) {
    //     // Vertical scroll
    //     const scrollDeltaY = canvas.height / 100;
    //     const vertical = -scrollDeltaY * (deltaY > 0 ? 1 : -1);
    //     console.log(vertical);
    //     canvas.relativePan(new fabric.Point(0, vertical));
    //   } else if (!isVerticalScroll && isCanvasLargerThanViewport) {
    //     // Horizontal scroll
    //     const scrollDeltaX = canvas.width / 300;
    //     const horisontal = -scrollDeltaX * (deltaX > 0 ? 1 : -1);
    //     console.log(horisontal);
    //     canvas.relativePan(new fabric.Point(horisontal, 0));
    //   }
    //   opt.e.preventDefault();
    //   opt.e.stopPropagation();
    // }

    canvas.on('mouse:wheel', function (opt) {
      var evt = window.event || opt.e;
      var scale = (evt.wheelDelta / 240 < 0 ? 0.9 : 1.1) * canvas.getZoom();
      canvas.zoomToPoint({
        x: opt.e.offsetX,
        y: opt.e.offsetY
      }, scale);
      if (opt.e != null) opt.e.preventDefault();
    });
    canvas.on('touch:gesture', function (event) {
      console.log('1 touch:gesture');

      if (event.e.touches && event.e.touches.length === 2) {
        var point1 = {
          x: event.e.touches[0].clientX,
          y: event.e.touches[0].clientY
        };
        var point2 = {
          x: event.e.touches[1].clientX,
          y: event.e.touches[1].clientY
        };
        var prevDistance = canvas.getPointerDistance(point1, point2);
        canvas.on('touch:gesture', function (event) {
          console.log('2 touch:gesture');
          var newDistance = canvas.getPointerDistance(point1, point2);
          var zoom = newDistance / prevDistance;
          var zoomPoint = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
          };
          canvas.zoomToPoint(zoomPoint, canvas.getZoom() * zoom);
          canvas.renderAll();
          newDistance, _readOnlyError("prevDistance");
        });
      }
    });
    canvas.on('object:added', function (event) {
      console.log('object:added', event.target.toJSON());
      onObjectAdded(event, canvas);
    });
    canvas.on('object:removed', function (event) {
      console.log('object:removed', event.target.toJSON());
      onObjectRemoved(event, canvas);
    });
    return function () {
      if (!canvas) return;
      canvas.off();
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
      var center = canvas.getCenter();

      _fabric.fabric.Image.fromURL(fileReaderInfo.currentPage, function (img) {
        console.log(img.width);

        if (img.width > img.height) {
          img.scaleToWidth(canvas.width);
        } else {
          img.scaleToHeight(canvas.height - 100);
        }

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          top: center.top,
          left: center.left,
          originX: 'center',
          originY: 'center'
        });
        canvas.renderAll();
      });
    }
  }, [fileReaderInfo.currentPage]);
  (0, _react.useEffect)(function () {
    if (!canvas) return;
    setDrawingMode(canvas, canvasOptions);
  }, [canvasOptions]);

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

  function saveCanvas() {
    var _extends3, _extends4;

    var newValue = _extends({}, canvasObjectsPerPage, (_extends4 = {}, _extends4[fileReaderInfo.file.name] = _extends({}, canvasObjectsPerPage[fileReaderInfo.file.name], (_extends3 = {}, _extends3[fileReaderInfo.currentPageNumber] = canvas.toJSON(), _extends3)), _extends4));

    console.log('saveCanvas', newValue);
    setCanvasObjectsPerPage(newValue);
  }

  function changeCurrentWidth(e) {
    var intValue = parseInt(e.target.value);
    canvasOptions.brushWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
    setCanvasOptions(_extends({}, canvasOptions, {
      brushWidth: intValue
    }));
  }

  function changeMode(mode) {
    if (canvasOptions.currentMode === mode) return;

    var newCanvasOptions = _extends({}, canvasOptions, {
      currentMode: mode
    });

    setCanvasOptions(newCanvasOptions);
  }

  function changeCurrentColor(color) {
    canvas.freeDrawingBrush.color = color;
    setCanvasOptions(_extends({}, canvasOptions, {
      currentColor: color
    }));
  }

  function changeFill(e) {
    setCanvasOptions(_extends({}, canvasOptions, {
      fill: !canvasOptions.fill
    }));
  }

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      (0, _fileSaver.saveAs)(blob, 'image.png');
    });
  }

  function onFileChange(event) {
    if (!event.target.files[0]) return;

    if (event.target.files[0].type.includes('image/')) {
      uploadImage(event);
    } else if (event.target.files[0].type.includes('pdf')) {
      saveCanvas();
      clearCanvas(canvas);
      updateFileReaderInfo({
        file: event.target.files[0],
        currentPageNumber: 1
      });
    }
  }

  function getPageJSON(_ref12) {
    var fileName = _ref12.fileName,
        pageNumber = _ref12.pageNumber;

    if (canvasObjectsPerPage[fileName] && canvasObjectsPerPage[fileName][pageNumber]) {
      return canvasObjectsPerPage[fileName][pageNumber];
    } else {
      return null;
    }
  }

  function updateFileReaderInfo(data) {
    // const board = new Board({
    //   width: whiteboardRef.current.clientWidth,
    //   height: whiteboardRef.current.clientHeight,
    //   ...canvasOptions,
    // });
    // setCanvas(board.canvas);
    var newFileData = _extends({}, fileReaderInfo, data);

    console.log(newFileData);
    setFileReaderInfo(newFileData);
  }

  var handlePageChange = function handlePageChange(page) {
    saveCanvas();
    clearCanvas(canvas);
    setFileReaderInfo(_extends({}, fileReaderInfo, {
      currentPageNumber: page
    }));
  };

  var handleZoomIn = function handleZoomIn() {
    console.log(canvas.getZoom());
    var scale = canvas.getZoom() * 1.1; // canvas.setZoom(scale);

    canvas.zoomToPoint({
      x: window.outerWidth / 2,
      y: window.outerHeight / 2
    }, scale);
  };

  var handleZoomOut = function handleZoomOut() {
    var scale = canvas.getZoom() / 1.1;
    canvas.zoomToPoint({
      x: window.outerWidth / 2,
      y: window.outerHeight / 2
    }, scale);
  };

  var handleResetZoom = function handleResetZoom() {
    canvas.setZoom(1);
  };

  var getControls = function getControls() {
    var _modeButtons;

    var modeButtons = (_modeButtons = {}, _modeButtons[modes.PENCIL] = {
      icon: _pencil.default,
      name: 'Pencil'
    }, _modeButtons[modes.LINE] = {
      icon: _line.default,
      name: 'Line'
    }, _modeButtons[modes.RECTANGLE] = {
      icon: _rectangle.default,
      name: 'Rectangle'
    }, _modeButtons[modes.ELLIPSE] = {
      icon: _ellipse.default,
      name: 'Ellipse'
    }, _modeButtons[modes.TRIANGLE] = {
      icon: _triangle.default,
      name: 'Triangle'
    }, _modeButtons[modes.TEXT] = {
      icon: _text.default,
      name: 'Text'
    }, _modeButtons[modes.SELECT] = {
      icon: _cross.default,
      name: 'Select'
    }, _modeButtons[modes.ERASER] = {
      icon: _eraser.default,
      name: 'Eraser'
    }, _modeButtons);
    return Object.keys(modeButtons).map(function (buttonKey) {
      if (!enabledControls[buttonKey]) return;
      var btn = modeButtons[buttonKey];
      return /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
        key: buttonKey,
        type: "button",
        className: "" + (canvasOptions.currentMode === buttonKey ? 'selected' : ''),
        onClick: function onClick() {
          return changeMode(buttonKey);
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: btn.icon,
        alt: btn.name
      }));
    });
  };

  return /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.WhiteBoardS, {
    ref: whiteboardRef
  }, /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarHolderS, null, /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarS, null, !!enabledControls.COLOR && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_ColorPicker.ColorPicker, {
    size: 28,
    color: canvasOptions.currentColor,
    onChange: changeCurrentColor
  })), !!enabledControls.BRUSH && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.RangeInputS, {
    type: "range",
    min: 1,
    max: 30,
    step: 1,
    thumbColor: canvasOptions.currentColor,
    value: canvasOptions.brushWidth,
    onChange: changeCurrentWidth
  })), !!enabledControls.FILL && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
    type: "button",
    className: canvasOptions.fill ? 'selected' : '',
    onClick: changeFill
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _colorFill.default,
    alt: "Delete"
  })), /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.SeparatorS, null), getControls(), !!enabledControls.CLEAR && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
    type: "button",
    onClick: function onClick() {
      return clearCanvas(canvas, canvasOptions);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _delete.default,
    alt: "Delete"
  })), /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.SeparatorS, null), !!enabledControls.FILES && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadPdfRef,
    hidden: true,
    accept: "image/*,.pdf",
    type: "file",
    onChange: onFileChange
  }), /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
    onClick: function onClick() {
      return uploadPdfRef.current.click();
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _addPhoto.default,
    alt: "Delete"
  }))), !!enabledControls.SAVE_AS_IMAGE && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
    onClick: onSaveCanvasAsImage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _download.default,
    alt: "Download"
  }))), /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.SeparatorS, null), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
    onClick: handleZoomIn,
    title: "Zoom In"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _zoomIn.default,
    alt: "Zoom In"
  }))), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
    onClick: handleResetZoom,
    title: "Reset Zoom"
  }, "100%")), !!enabledControls.ZOOM && /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ToolbarItemS, null, /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.ButtonS, {
    onClick: handleZoomOut,
    title: "Zoom Out"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _zoomOut.default,
    alt: "Zoom Out"
  }))))), /*#__PURE__*/_react.default.createElement("canvas", {
    ref: canvasRef,
    id: "canvas"
  }), /*#__PURE__*/_react.default.createElement(_WhiteBoardStyled.PDFWrapperS, null, /*#__PURE__*/_react.default.createElement(_PdfReader.default, {
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