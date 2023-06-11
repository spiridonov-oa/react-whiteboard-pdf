"use strict";

exports.__esModule = true;
exports.modes = exports.Board = void 0;

var _fabric = require("fabric");

var _cursors = require("./cursors");

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
exports.modes = modes;

var Board = /*#__PURE__*/function () {
  function Board(params) {
    this.canvas = void 0;
    this.modes = void 0;
    this.cursorPencil = (0, _cursors.getCursor)('pencil');
    this.mouseDown = false;
    this.drawInstance = null;
    this.drawingSettings = void 0;
    this.canvasSettings = {
      zoom: 1,
      contentJSON: null,
      minZoom: 0.05,
      maxZoom: 9.99
    };

    if (params) {
      this.drawingSettings = params.drawingSettings;
      this.canvasSettings = _extends({}, this.canvasSettings, params.canvasSettings);
    }

    this.canvas = this.initCanvas(this.drawingSettings, this.canvasSettings);
    this.modes = modes;
    this.resetZoom();
    this.setDrawingMode(this.drawingSettings.currentMode);
    this.addZoomListeners();
  }

  var _proto = Board.prototype;

  _proto.initCanvas = function initCanvas(drawingSettings, canvasSettings) {
    _fabric.fabric.Canvas.prototype.getItemByAttr = function (attr, name) {
      var object = null,
          objects = this.getObjects();

      for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i][attr] && objects[i][attr] === name) {
          object = objects[i];
          break;
        }
      }

      return object;
    };

    var canvasElement = document.getElementById('canvas');
    if (!canvasElement) return;
    var parentElement = canvasElement.parentNode;
    var canvas = new _fabric.fabric.Canvas('canvas', {
      width: drawingSettings.width,
      height: drawingSettings.height
    });
    canvas.zoomToPoint({
      x: canvas.width / 2,
      y: canvas.height / 2
    }, canvasSettings.zoom);

    if (canvasSettings.contentJSON) {
      canvas.loadFromJSON(canvasSettings.contentJSON);
    }

    canvas.perPixelTargetFind = true;

    if (parentElement) {
      this.element = this.handleResize(this.resizeCanvas(canvas, parentElement).bind(this));
      this.element.observe(parentElement);
    }

    return canvas;
  };

  _proto.addZoomListeners = function addZoomListeners() {
    var canvas = this.canvas;
    var that = this;
    canvas.off('mouse:wheel');
    canvas.off('touch:gesture');
    canvas.on('mouse:wheel', function (opt) {
      opt.e.preventDefault();
      opt.e.stopPropagation();

      if (opt.e.ctrlKey) {
        var delta = opt.e.deltaY;
        var scale = Math.pow(0.995, delta);
        var point = {
          x: opt.e.offsetX,
          y: opt.e.offsetY
        };
        that.changeZoom({
          point: point,
          scale: scale
        });
      } else {
        var e = opt.e;
        var vpt = canvas.viewportTransform;
        vpt[4] -= e.deltaX;
        vpt[5] -= e.deltaY; // const boundaries = that.getCanvasContentBoundaries();
        // let scrolledX = vpt[4] + e.deltaX;
        // let scrolledY = vpt[5] + e.deltaY;
        // console.log('scrolled', scrolledX, scrolledY);
        // console.log('boundaries', boundaries);
        // const offset = 50;
        // scrolledX =
        //   scrolledX < -boundaries.maxX + offset
        //     ? -boundaries.maxX + offset
        //     : -scrolledX < boundaries.minX - canvas.width + offset
        //     ? canvas.width - boundaries.minX - offset
        //     : scrolledX;
        // scrolledY =
        //   scrolledY < -boundaries.maxY + offset
        //     ? -boundaries.maxY + offset
        //     : -scrolledY < boundaries.minY - canvas.height + offset
        //     ? canvas.height - boundaries.minY - offset
        //     : scrolledY;
        // that.throttle(() => console.log('after', scrolledX, scrolledY));
        // vpt[4] = scrolledX;
        // vpt[5] = scrolledY;
        // console.log(vpt);

        canvas.requestRenderAll();
      }
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
          var point = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
          };
          var scale = zoom;
          that.changeZoom({
            point: point,
            scale: scale
          });
          canvas.renderAll();
          newDistance, _readOnlyError("prevDistance");
        });
      }
    });
  };

  _proto.setDrawingSettings = function setDrawingSettings(drawingSettings) {
    this.drawingSettings = _extends({}, this.drawingSettings, drawingSettings);
    this.setDrawingMode(this.drawingSettings.currentMode);
  };

  _proto.setDrawingMode = function setDrawingMode(mode) {
    this.drawingSettings.currentMode = mode;
    this.resetCanvas();

    switch (mode) {
      case this.modes.PENCIL:
        this.draw();
        break;

      case this.modes.LINE:
        this.createLine();
        break;

      case this.modes.RECTANGLE:
        this.createRect();
        break;

      case this.modes.ELLIPSE:
        this.createEllipse();
        break;

      case this.modes.TRIANGLE:
        this.createTriangle();
        break;

      case this.modes.ERASER:
        this.eraserOn();
        break;

      case this.modes.SELECT:
        this.onSelectMode();
        break;

      case this.modes.TEXT:
        this.createText();
        break;

      default:
        this.draw();
    }
  };

  _proto.resetCanvas = function resetCanvas() {
    var canvas = this.canvas;
    this.removeCanvasListener(canvas);
    canvas.selection = false;
    canvas.isDrawingMode = false;
    canvas.defaultCursor = 'auto';
    canvas.hoverCursor = 'auto';
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: false
      });
    });

    if (this.editedTextObject) {
      this.editedTextObject.exitEditing();
      this.editedTextObject = null;
    }
  };

  _proto.throttle = function throttle(f, delay) {
    if (delay === void 0) {
      delay = 300;
    }

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
  };

  _proto.handleResize = function handleResize(callback) {
    var resize_ob = new ResizeObserver(this.throttle(callback, 300));
    return resize_ob;
  };

  _proto.resizeCanvas = function resizeCanvas(canvas, whiteboard) {
    return function () {
      var width = whiteboard.clientWidth;
      var height = whiteboard.clientHeight;
      this.changeZoom({
        scale: 1
      }); // const scale = width / canvas.getWidth();
      // const zoom = canvas.getZoom() * scale;

      canvas.setDimensions({
        width: width,
        height: height
      }); // canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    };
  };

  _proto.removeCanvasListener = function removeCanvasListener() {
    var canvas = this.canvas;
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('mouse:over');
  };

  _proto.draw = function draw() {
    var canvas = this.canvas;
    var drawingSettings = this.drawingSettings;
    canvas.freeDrawingBrush = new _fabric.fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = drawingSettings.brushWidth;
    canvas.freeDrawingBrush.color = drawingSettings.currentColor;
    canvas.isDrawingMode = true;
    canvas.freeDrawingCursor = this.cursorPencil;
  };

  _proto.createLine = function createLine() {
    var canvas = this.canvas;
    canvas.on('mouse:down', this.startAddLine().bind(this));
    canvas.on('mouse:move', this.startDrawingLine().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.discardActiveObject().requestRenderAll();
  };

  _proto.startAddLine = function startAddLine() {
    var canvas = this.canvas;
    var drawingSettings = this.drawingSettings;
    return function (_ref) {
      var e = _ref.e;
      this.mouseDown = true;
      var pointer = canvas.getPointer(e);
      this.drawInstance = new _fabric.fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: drawingSettings.brushWidth,
        stroke: drawingSettings.currentColor,
        selectable: false
      });
      canvas.add(this.drawInstance);
      canvas.requestRenderAll();
    };
  };

  _proto.startDrawingLine = function startDrawingLine() {
    var canvas = this.canvas;
    return function (_ref2) {
      var e = _ref2.e;

      if (this.mouseDown) {
        var pointer = canvas.getPointer(e);
        this.drawInstance.set({
          x2: pointer.x,
          y2: pointer.y
        });
        this.drawInstance.setCoords();
        canvas.requestRenderAll();
      }
    };
  };

  _proto.createRect = function createRect() {
    var canvas = this.canvas;
    canvas.isDrawingMode = true;
    canvas.on('mouse:down', this.startAddRect().bind(this));
    canvas.on('mouse:move', this.startDrawingRect().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));
    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: false
      });
    });
    canvas.discardActiveObject().requestRenderAll();
  };

  _proto.startAddRect = function startAddRect() {
    var canvas = this.canvas;
    var drawingSettings = this.drawingSettings;
    return function (_ref3) {
      var e = _ref3.e;
      this.mouseDown = true;
      var pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new _fabric.fabric.Rect({
        stroke: drawingSettings.currentColor,
        strokeWidth: drawingSettings.brushWidth,
        fill: drawingSettings.fill ? drawingSettings.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        width: 0,
        height: 0,
        selectable: false
      });
      canvas.add(this.drawInstance);
      this.drawInstance.on('mousedown', function (e) {
        if (drawingSettings.currentMode === this.modes.ERASER) {
          canvas.remove(e.target);
        }
      }.bind(this));
    };
  };

  _proto.startDrawingRect = function startDrawingRect() {
    var canvas = this.canvas;
    return function (_ref4) {
      var e = _ref4.e;

      if (this.mouseDown) {
        var pointer = canvas.getPointer(e);

        if (pointer.x < this.origX) {
          this.drawInstance.set('left', pointer.x);
        }

        if (pointer.y < this.origY) {
          this.drawInstance.set('top', pointer.y);
        }

        this.drawInstance.set({
          width: Math.abs(pointer.x - this.origX),
          height: Math.abs(pointer.y - this.origY)
        });
        this.drawInstance.setCoords();
        canvas.renderAll();
      }
    };
  };

  _proto.stopDrawing = function stopDrawing() {
    this.mouseDown = false;
  };

  _proto.createEllipse = function createEllipse() {
    //main
    var canvas = this.canvas;
    canvas.isDrawingMode = true;
    canvas.on('mouse:down', this.startAddEllipse().bind(this));
    canvas.on('mouse:move', this.startDrawingEllipse().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));
    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: false
      });
    });
    canvas.discardActiveObject().requestRenderAll();
  };

  _proto.startAddEllipse = function startAddEllipse() {
    var canvas = this.canvas;
    var drawingSettings = this.drawingSettings;
    return function (_ref5) {
      var e = _ref5.e;
      this.mouseDown = true;
      var pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new _fabric.fabric.Ellipse({
        stroke: drawingSettings.currentColor,
        strokeWidth: drawingSettings.brushWidth,
        fill: drawingSettings.fill ? drawingSettings.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        cornerSize: 7,
        objectCaching: false,
        selectable: false
      });
      canvas.add(this.drawInstance);
    };
  };

  _proto.startDrawingEllipse = function startDrawingEllipse() {
    var canvas = this.canvas;
    return function (_ref6) {
      var e = _ref6.e;

      if (this.mouseDown) {
        var pointer = canvas.getPointer(e);

        if (pointer.x < this.origX) {
          this.drawInstance.set('left', pointer.x);
        }

        if (pointer.y < this.origY) {
          this.drawInstance.set('top', pointer.y);
        }

        this.drawInstance.set({
          rx: Math.abs(pointer.x - this.origX) / 2,
          ry: Math.abs(pointer.y - this.origY) / 2
        });
        this.drawInstance.setCoords();
        canvas.renderAll();
      }
    };
  };

  _proto.createTriangle = function createTriangle() {
    var canvas = this.canvas;
    canvas.isDrawingMode = true;
    canvas.on('mouse:down', this.startAddTriangle().bind(this));
    canvas.on('mouse:move', this.startDrawingTriangle().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));
    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: false
      });
    });
    canvas.discardActiveObject().requestRenderAll();
  };

  _proto.startAddTriangle = function startAddTriangle() {
    var canvas = this.canvas;
    var drawingSettings = this.drawingSettings;
    return function (_ref7) {
      var e = _ref7.e;
      this.mouseDown = true;
      drawingSettings.currentMode = this.modes.TRIANGLE;
      var pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new _fabric.fabric.Triangle({
        stroke: drawingSettings.currentColor,
        strokeWidth: drawingSettings.brushWidth,
        fill: drawingSettings.fill ? drawingSettings.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        width: 0,
        height: 0,
        selectable: false
      });
      canvas.add(this.drawInstance);
    };
  };

  _proto.startDrawingTriangle = function startDrawingTriangle() {
    var canvas = this.canvas;
    return function (_ref8) {
      var e = _ref8.e;

      if (this.mouseDown) {
        var pointer = canvas.getPointer(e);

        if (pointer.x < this.origX) {
          this.drawInstance.set('left', pointer.x);
        }

        if (pointer.y < this.origY) {
          this.drawInstance.set('top', pointer.y);
        }

        this.drawInstance.set({
          width: Math.abs(pointer.x - this.origX),
          height: Math.abs(pointer.y - this.origY)
        });
        this.drawInstance.setCoords();
        canvas.renderAll();
      }
    };
  };

  _proto.createText = function createText() {
    var _this2 = this;

    var canvas = this.canvas;
    canvas.isDrawingMode = true;
    canvas.on('mouse:down', function (e) {
      return _this2.addText.call(_this2, e);
    });
    canvas.isDrawingMode = false;
  };

  _proto.addText = function addText(e) {
    var canvas = this.canvas;
    var drawingSettings = this.drawingSettings;
    var pointer = canvas.getPointer(e);
    this.origX = pointer.x;
    this.origY = pointer.y;
    var text = new _fabric.fabric.Textbox('', {
      left: this.origX - 10,
      top: this.origY - 10,
      fontSize: drawingSettings.brushWidth * 3 + 10,
      fill: drawingSettings.currentColor,
      editable: true,
      perPixelTargetFind: false,
      keysMap: {
        13: 'exitEditing'
      }
    });
    canvas.add(text);
    canvas.renderAll();
    text.enterEditing();
    this.editedTextObject = text;
    canvas.off('mouse:down');
    canvas.once('mouse:down', function (e1) {
      var _this3 = this;

      if (text.isEditing) {
        text.exitEditing();
        this.editedTextObject = null;
        canvas.once('mouse:down', function (e2) {
          _this3.addText.call(_this3, e2);
        });
      } else {
        this.addText.call(this, e1);
      }
    }.bind(this));
  };

  _proto.eraserOn = function eraserOn() {
    var canvas = this.canvas;
    canvas.isDrawingMode = false;
    canvas.on('mouse:down', function (event) {
      canvas.remove(event.target);
      canvas.on('mouse:move', function (e) {
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
  };

  _proto.onSelectMode = function onSelectMode() {
    var canvas = this.canvas;
    var drawingSettings = this.drawingSettings;
    drawingSettings.currentMode = '';
    canvas.isDrawingMode = false;
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: true
      });
    });
    canvas.hoverCursor = 'all-scroll';
  };

  _proto.clearCanvas = function clearCanvas() {
    var canvas = this.canvas;
    canvas.getObjects().forEach(function (item) {
      if (item !== canvas.backgroundImage) {
        canvas.remove(item);
      }
    });
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
  };

  _proto.changeZoom = function changeZoom(_ref9) {
    var point = _ref9.point,
        scale = _ref9.scale;

    if (!point) {
      var width = this.canvas.width;
      var height = this.canvas.height;
      point = {
        x: width / 2,
        y: height / 2
      };
    }

    var minZoom = this.canvasSettings.minZoom;
    var maxZoom = this.canvasSettings.maxZoom;
    scale = this.canvas.getZoom() * scale;
    scale = scale < minZoom ? minZoom : scale > maxZoom ? maxZoom : scale;
    this.canvas.zoomToPoint(point, scale);
    this.onZoom({
      point: point,
      scale: scale
    });
  };

  _proto.resetZoom = function resetZoom() {
    var width = this.canvas.width;
    var height = this.canvas.height;
    var point = {
      x: width / 2,
      y: height / 2
    };
    var scale = 1;
    this.canvas.zoomToPoint(point, scale);
    this.onZoom({
      point: point,
      scale: scale
    });
  };

  _proto.onZoom = function onZoom(params) {
    this.addZoomListeners();
    this.canvas.fire('zoom', params);
  };

  _proto.openPage = function openPage(page) {
    var canvas = this.canvas;
    var center = canvas.getCenter();

    _fabric.fabric.Image.fromURL(page, function (img) {
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
  };

  _proto.getCanvasContentBoundaries = function getCanvasContentBoundaries() {
    var canvas = this.canvas;
    var objects = canvas.getObjects(); // Initialize variables for min and max coordinates

    var minX = 10000;
    var minY = 10000;
    var maxX = -10000;
    var maxY = -10000; // Iterate through objects to find minimum and maximum coordinates

    objects.forEach(function (object) {
      var objectBoundingBox = object.getBoundingRect();
      minX = Math.min(minX, objectBoundingBox.left);
      minY = Math.min(minY, objectBoundingBox.top);
      maxX = Math.max(maxX, objectBoundingBox.left + objectBoundingBox.width);
      maxY = Math.max(maxY, objectBoundingBox.top + objectBoundingBox.height);
    }); // Calculate canvas size based on content

    var width = maxX - minX;
    var height = maxY - minY;
    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      width: width,
      height: height
    };
  };

  _proto.removeBoard = function removeBoard() {
    this.element.disconnect();
    this.canvas.off();
    this.canvas.dispose();
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
  ;

  return Board;
}();

exports.Board = Board;