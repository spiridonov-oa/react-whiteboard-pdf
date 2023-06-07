import { fabric } from 'fabric';
import { getCursor } from './cursors';

export const modes = {
  PENCIL: 'PENCIL',
  LINE: 'LINE',
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  ERASER: 'ERASER',
  SELECT: 'SELECT',
  TEXT: 'TEXT',
};

export class Board {
  canvas;
  modes;
  cursorPencil = getCursor('pencil');
  mouseDown = false;
  drawInstance = null;
  drawingSettings;
  canvasSettings = {
    zoom: 1,
    contentJSON: null,
    minZoom: 0.05,
    maxZoom: 9.99,
  };

  constructor(params) {
    if (params) {
      this.drawingSettings = params.drawingSettings;
      this.canvasSettings = { ...this.canvasSettings, ...params.canvasSettings };
    }

    this.canvas = this.initCanvas(this.drawingSettings, this.canvasSettings);
    this.modes = modes;
    this.setDrawingMode(this.drawingSettings.currentMode);
    this.addZoomListeners();
  }

  initCanvas(drawingSettings, canvasSettings) {
    fabric.Canvas.prototype.getItemByAttr = function (attr, name) {
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

    const canvas = new fabric.Canvas('canvas', {
      width: drawingSettings.width,
      height: drawingSettings.height,
    });

    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, canvasSettings.zoom);

    if (canvasSettings.contentJSON) {
      canvas.loadFromJSON(canvasSettings.contentJSON);
    }

    canvas.perPixelTargetFind = true;

    return canvas;
  }

  addZoomListeners() {
    const canvas = this.canvas;
    const that = this;
    canvas.on('mouse:wheel', function (opt) {
      opt.e.preventDefault();
      opt.e.stopPropagation();
      if (opt.e.ctrlKey) {
        const delta = opt.e.deltaY;
        const scale = 0.98 ** delta;
        const point = { x: opt.e.offsetX, y: opt.e.offsetY };
        that.changeZoom({ point, scale });
      } else {
        const e = opt.e;
        let vpt = canvas.viewportTransform;
        vpt[4] -= e.deltaX;
        vpt[5] -= e.deltaY;
        console.log(vpt);
        canvas.requestRenderAll();
      }
    });

    canvas.on('touch:gesture', (event) => {
      console.log('1 touch:gesture');
      if (event.e.touches && event.e.touches.length === 2) {
        const point1 = {
          x: event.e.touches[0].clientX,
          y: event.e.touches[0].clientY,
        };
        const point2 = {
          x: event.e.touches[1].clientX,
          y: event.e.touches[1].clientY,
        };

        const prevDistance = canvas.getPointerDistance(point1, point2);

        canvas.on('touch:gesture', (event) => {
          console.log('2 touch:gesture');
          const newDistance = canvas.getPointerDistance(point1, point2);
          const zoom = newDistance / prevDistance;

          const point = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
          };

          const scale = zoom;

          that.changeZoom({ point, scale });
          canvas.renderAll();

          prevDistance = newDistance;
        });
      }
    });
  }

  setDrawingSettings(drawingSettings) {
    this.drawingSettings = { ...this.drawingSettings, ...drawingSettings };
    this.setDrawingMode(this.drawingSettings.currentMode);
  }

  setDrawingMode(mode) {
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
  }

  resetCanvas() {
    const canvas = this.canvas;

    this.removeCanvasListener(canvas);
    canvas.selection = false;
    canvas.isDrawingMode = false;
    canvas.defaultCursor = 'auto';
    canvas.hoverCursor = 'auto';
    canvas.getObjects().map((item) => item.set({ selectable: false }));

    if (this.editedTextObject) {
      this.editedTextObject.exitEditing();
      this.editedTextObject = null;
    }
  }

  removeCanvasListener() {
    const canvas = this.canvas;
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('mouse:over');
  }

  draw() {
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = drawingSettings.brushWidth;
    canvas.freeDrawingBrush.color = drawingSettings.currentColor;
    canvas.isDrawingMode = true;
    canvas.freeDrawingCursor = this.cursorPencil;
  }

  createLine() {
    const canvas = this.canvas;

    canvas.on('mouse:down', this.startAddLine().bind(this));
    canvas.on('mouse:move', this.startDrawingLine().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));

    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddLine() {
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    return function ({ e }) {
      this.mouseDown = true;

      let pointer = canvas.getPointer(e);
      this.drawInstance = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: drawingSettings.brushWidth,
        stroke: drawingSettings.currentColor,
        selectable: false,
      });

      canvas.add(this.drawInstance);
      canvas.requestRenderAll();
    };
  }

  startDrawingLine() {
    const canvas = this.canvas;
    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getPointer(e);
        this.drawInstance.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        this.drawInstance.setCoords();
        canvas.requestRenderAll();
      }
    };
  }

  createRect() {
    const canvas = this.canvas;
    canvas.isDrawingMode = true;

    canvas.on('mouse:down', this.startAddRect().bind(this));
    canvas.on('mouse:move', this.startDrawingRect().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));

    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddRect() {
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    return function ({ e }) {
      this.mouseDown = true;

      const pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;

      this.drawInstance = new fabric.Rect({
        stroke: drawingSettings.currentColor,
        strokeWidth: drawingSettings.brushWidth,
        fill: drawingSettings.fill ? drawingSettings.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        width: 0,
        height: 0,
        selectable: false,
      });

      canvas.add(this.drawInstance);

      this.drawInstance.on(
        'mousedown',
        function (e) {
          if (drawingSettings.currentMode === this.modes.ERASER) {
            canvas.remove(e.target);
          }
        }.bind(this),
      );
    };
  }

  startDrawingRect() {
    const canvas = this.canvas;
    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getPointer(e);

        if (pointer.x < this.origX) {
          this.drawInstance.set('left', pointer.x);
        }
        if (pointer.y < this.origY) {
          this.drawInstance.set('top', pointer.y);
        }
        this.drawInstance.set({
          width: Math.abs(pointer.x - this.origX),
          height: Math.abs(pointer.y - this.origY),
        });
        this.drawInstance.setCoords();
        canvas.renderAll();
      }
    };
  }

  stopDrawing() {
    this.mouseDown = false;
  }

  createEllipse() {
    //main
    const canvas = this.canvas;
    canvas.isDrawingMode = true;

    canvas.on('mouse:down', this.startAddEllipse().bind(this));
    canvas.on('mouse:move', this.startDrawingEllipse().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));

    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddEllipse() {
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    return function ({ e }) {
      this.mouseDown = true;

      const pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new fabric.Ellipse({
        stroke: drawingSettings.currentColor,
        strokeWidth: drawingSettings.brushWidth,
        fill: drawingSettings.fill ? drawingSettings.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        cornerSize: 7,
        objectCaching: false,
        selectable: false,
      });

      canvas.add(this.drawInstance);
    };
  }

  startDrawingEllipse() {
    const canvas = this.canvas;

    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getPointer(e);
        if (pointer.x < this.origX) {
          this.drawInstance.set('left', pointer.x);
        }
        if (pointer.y < this.origY) {
          this.drawInstance.set('top', pointer.y);
        }
        this.drawInstance.set({
          rx: Math.abs(pointer.x - this.origX) / 2,
          ry: Math.abs(pointer.y - this.origY) / 2,
        });
        this.drawInstance.setCoords();
        canvas.renderAll();
      }
    };
  }

  createTriangle() {
    const canvas = this.canvas;
    canvas.isDrawingMode = true;

    canvas.on('mouse:down', this.startAddTriangle().bind(this));
    canvas.on('mouse:move', this.startDrawingTriangle().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));

    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddTriangle() {
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    return function ({ e }) {
      this.mouseDown = true;
      drawingSettings.currentMode = this.modes.TRIANGLE;

      const pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new fabric.Triangle({
        stroke: drawingSettings.currentColor,
        strokeWidth: drawingSettings.brushWidth,
        fill: drawingSettings.fill ? drawingSettings.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        width: 0,
        height: 0,
        selectable: false,
      });

      canvas.add(this.drawInstance);
    };
  }

  startDrawingTriangle() {
    const canvas = this.canvas;
    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getPointer(e);
        if (pointer.x < this.origX) {
          this.drawInstance.set('left', pointer.x);
        }
        if (pointer.y < this.origY) {
          this.drawInstance.set('top', pointer.y);
        }
        this.drawInstance.set({
          width: Math.abs(pointer.x - this.origX),
          height: Math.abs(pointer.y - this.origY),
        });

        this.drawInstance.setCoords();
        canvas.renderAll();
      }
    };
  }

  createText() {
    const canvas = this.canvas;
    canvas.isDrawingMode = true;

    canvas.on('mouse:down', (e) => this.addText.call(this, e));

    canvas.isDrawingMode = false;
  }

  addText(e) {
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;

    const pointer = canvas.getPointer(e);
    this.origX = pointer.x;
    this.origY = pointer.y;
    const text = new fabric.Textbox('', {
      left: this.origX - 10,
      top: this.origY - 10,
      fontSize: drawingSettings.brushWidth * 3 + 10,
      fill: drawingSettings.currentColor,
      editable: true,
      perPixelTargetFind: false,
      keysMap: {
        13: 'exitEditing',
      },
    });

    canvas.add(text);
    canvas.renderAll();

    text.enterEditing();

    this.editedTextObject = text;

    canvas.off('mouse:down');
    canvas.once(
      'mouse:down',
      function (e1) {
        if (text.isEditing) {
          text.exitEditing();
          this.editedTextObject = null;
          canvas.once('mouse:down', (e2) => {
            this.addText.call(this, e2);
          });
        } else {
          this.addText.call(this, e1);
        }
      }.bind(this),
    );
  }

  eraserOn() {
    const canvas = this.canvas;
    canvas.isDrawingMode = false;

    canvas.on('mouse:down', (event) => {
      canvas.remove(event.target);

      canvas.on('mouse:move', (e) => {
        canvas.remove(e.target);
      });
    });

    canvas.on('mouse:up', () => {
      canvas.off('mouse:move');
    });

    canvas.on('mouse:over', (event) => {
      const hoveredObject = event.target;
      if (hoveredObject) {
        hoveredObject.set({
          opacity: 0.2,
        });
        canvas.requestRenderAll();
      }
    });

    canvas.on('mouse:out', (event) => {
      const hoveredObject = event.target;
      if (hoveredObject) {
        hoveredObject.set({
          opacity: 1,
        });
        canvas.requestRenderAll();
      }
    });

    canvas.defaultCursor = getCursor('eraser');
    canvas.hoverCursor = getCursor('eraser');
  }

  onSelectMode() {
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    drawingSettings.currentMode = '';
    canvas.isDrawingMode = false;

    canvas.getObjects().map((item) => item.set({ selectable: true }));
    canvas.hoverCursor = 'all-scroll';
  }

  clearCanvas() {
    const canvas = this.canvas;
    canvas.getObjects().forEach(function (item) {
      if (item !== canvas.backgroundImage) {
        canvas.remove(item);
      }
    });
  }

  changeZoom({ point, scale }) {
    if (!point) {
      const width = this.canvas.width;
      const height = this.canvas.height;
      point = { x: width / 2, y: height / 2 };
    }

    const minZoom = this.canvasSettings.minZoom;
    const maxZoom = this.canvasSettings.maxZoom;

    scale = this.canvas.getZoom() * scale;
    scale = scale < minZoom ? minZoom : scale > maxZoom ? maxZoom : scale;

    this.canvas.zoomToPoint(point, scale);
    this.onZoom({ point, scale });
  }

  resetZoom() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const point = { x: width / 2, y: height / 2 };
    const scale = 1;
    this.canvas.zoomToPoint(point, scale);
    this.onZoom({ point, scale });
  }

  onZoom(params) {
    this.canvas.fire('zoom', params);
  }

  removeBoard() {
    this.canvas.off();
    this.canvas.dispose();
  }

  // function drawBackground(canvas) {
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
}
