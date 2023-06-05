import { fabric } from 'fabric';
import { getCursor } from './cursors';

export class Board {
  canvas = null;
  modes = {
    PENCIL: 'PENCIL',
    LINE: 'LINE',
    RECTANGLE: 'RECTANGLE',
    TRIANGLE: 'TRIANGLE',
    ELLIPSE: 'ELLIPSE',
    ERASER: 'ERASER',
    SELECT: 'SELECT',
    TEXT: 'TEXT',
  };
  cursorPencil = getCursor('pencil');
  mouseDown = false;
  drawInstance = null;

  constructor(options) {
    this.canvas = this.initCanvas(options);
    this.options = options;
    this.setDrawingMode(options.currentMode);
  }

  initCanvas(options) {
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

    const canvas = new fabric.Canvas('canvas', { width: options.width, height: options.height });

    // Todo: Ready to remove
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.cornerSize = 6;
    fabric.Object.prototype.padding = 10;
    fabric.Object.prototype.borderDashArray = [5, 5];

    return canvas;
  }

  setDrawingMode(currentMode) {
    this.resetCanvas();

    switch (currentMode) {
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
    const options = this.options;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas, {
      perPixelTargetFind: true,
    });
    canvas.freeDrawingBrush.width = options.brushWidth;
    canvas.freeDrawingBrush.color = options.currentColor;
    canvas.isDrawingMode = true;
    canvas.freeDrawingCursor = this.cursorPencil;
  }

  createLine() {
    const canvas = this.canvas;

    canvas.on('mouse:down', this.startAddLine());
    canvas.on('mouse:move', this.startDrawingLine());
    canvas.on('mouse:up', this.stopDrawing);

    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddLine() {
    const canvas = this.canvas;
    const options = this.options;
    return function ({ e }) {
      this.mouseDown = true;

      let pointer = canvas.getPointer(e);
      this.drawInstance = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: options.brushWidth,
        stroke: options.currentColor,
        selectable: false,
        perPixelTargetFind: true,
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

    canvas.on('mouse:down', this.startAddRect());
    canvas.on('mouse:move', this.startDrawingRect());
    canvas.on('mouse:up', this.stopDrawing);

    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddRect() {
    const canvas = this.canvas;
    const options = this.options;
    return function ({ e }) {
      this.mouseDown = true;

      const pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;

      this.drawInstance = new fabric.Rect({
        stroke: options.currentColor,
        strokeWidth: options.brushWidth,
        fill: options.fill ? options.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        width: 0,
        height: 0,
        selectable: false,
        perPixelTargetFind: true,
      });

      canvas.add(this.drawInstance);

      this.drawInstance.on('mousedown', function (e) {
        if (options.currentMode === this.modes.ERASER) {
          canvas.remove(e.target);
        }
      });
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

    canvas.on('mouse:down', this.startAddEllipse());
    canvas.on('mouse:move', this.startDrawingEllipse());
    canvas.on('mouse:up', this.stopDrawing);

    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddEllipse() {
    const canvas = this.canvas;
    const options = this.options;
    return function ({ e }) {
      this.mouseDown = true;

      const pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new fabric.Ellipse({
        stroke: options.currentColor,
        strokeWidth: options.brushWidth,
        fill: options.fill ? options.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        cornerSize: 7,
        objectCaching: false,
        selectable: false,
        perPixelTargetFind: true,
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

    canvas.on('mouse:down', this.startAddTriangle());
    canvas.on('mouse:move', this.startDrawingTriangle());
    canvas.on('mouse:up', this.stopDrawing);

    canvas.selection = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }

  startAddTriangle() {
    const canvas = this.canvas;
    const options = this.options;
    return function ({ e }) {
      this.mouseDown = true;
      options.currentMode = this.modes.TRIANGLE;

      const pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new fabric.Triangle({
        stroke: options.currentColor,
        strokeWidth: options.brushWidth,
        fill: options.fill ? options.currentColor : 'transparent',
        left: this.origX,
        top: this.origY,
        width: 0,
        height: 0,
        selectable: false,
        perPixelTargetFind: true,
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

    canvas.on('mouse:down', this.addText());

    canvas.isDrawingMode = false;
  }

  addText() {
    const canvas = this.canvas;
    const options = this.options;
    return function ({ e }) {
      const pointer = canvas.getPointer(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      const text = new fabric.Textbox('', {
        left: this.origX - 10,
        top: this.origY - 10,
        fontSize: options.brushWidth * 5,
        fill: options.currentColor,
        editable: true,
        keysMap: {
          13: 'exitEditing',
        },
      });

      canvas.add(text);
      canvas.renderAll();

      text.enterEditing();

      canvas.off('mouse:down');
      canvas.on('mouse:down', function () {
        text.exitEditing();
        canvas.off('mouse:down');
        canvas.on('mouse:down', this.addText);
      });
    };
  }

  eraserOn() {
    const canvas = this.canvas;
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
      const hoveredObject = event.target;
      if (hoveredObject) {
        hoveredObject.set({
          opacity: 0.2,
        });
        canvas.requestRenderAll();
      }
    });

    canvas.on('mouse:out', function (event) {
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
    const options = this.options;
    options.currentMode = '';
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
      // if (options.background) {
      //   drawBackground(canvas);
      // }
    });
  }
}
