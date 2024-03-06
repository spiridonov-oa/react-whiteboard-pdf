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
  canvasConfig = {
    zoom: 1,
    contentJSON: null,
    minZoom: 0.05,
    maxZoom: 9.99,
    viewportTransform: [1, 0, 0, 1, 0, 0],
  };

  // [Sketch range limits]
  nowX = 0;
  nowY = 0;
  canvasRef;
  limitScale = 10;
  sketchWidthLimit = 1920 * this.limitScale;
  sketchHeightLimit = 1080 * this.limitScale;

  constructor(params) {
    // [Sketch range limits]
    const windowWidth =
      this.limitScale *
      (window.screen.width ||
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth);
    const windowHeight =
      this.limitScale *
      (window.screen.height ||
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight);
    this.sketchWidthLimit =
      windowWidth > this.sketchWidthLimit ? windowWidth : this.sketchWidthLimit;
    this.sketchHeightLimit =
      windowHeight > this.sketchHeightLimit ? windowHeight : this.sketchHeightLimit;

    if (params) {
      this.canvasRef = params.canvasRef;
      this.drawingSettings = params.drawingSettings;
    }
    this.canvas = this.initCanvas(this.canvasConfig);

    this.canvas.once('after:render', () => {
      this.applyCanvasConfig(params.canvasConfig);
    });

    this.modes = modes;
    this.resetZoom();
    this.setDrawingMode(this.drawingSettings.currentMode);
    this.addZoomListeners();
  }

  initCanvas() {
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

    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) return;

    const parentElement = canvasElement.parentNode;

    const canvas = new fabric.Canvas('canvas');
    canvas.perPixelTargetFind = true;

    if (parentElement) {
      this.element = this.handleResize(this.resizeCanvas(canvas, parentElement).bind(this));
      this.element.observe(parentElement);
    }

    return canvas;
  }

  applyCanvasConfig(canvasConfig) {
    this.canvasConfig = { ...this.canvasConfig, ...canvasConfig };
    if (this.canvasConfig.zoom) {
      this.canvas.setZoom(this.canvasConfig.zoom);
    }
    if (this.canvasConfig.contentJSON) {
      this.canvas.loadFromJSON(this.canvasConfig.contentJSON);
    }
    if (this.canvasConfig.viewportTransform) {
      this.canvas.viewportTransform = this.canvasConfig.viewportTransform;
      this.changeZoom({ scale: 1 });
    }
    this.canvas.requestRenderAll();
    console.log(this.canvas.getObjects());
    this.canvas.fire('config:chnage');
  }

  addZoomListeners(params) {
    const canvas = this.canvas;
    const that = this;
    canvas.off('mouse:wheel');
    canvas.off('touch:gesture');

    canvas.on('mouse:wheel', function (opt) {
      opt.e.preventDefault();
      opt.e.stopPropagation();
      if (opt.e.ctrlKey) {
        const delta = opt.e.deltaY;
        const scale = 0.995 ** delta;
        const point = { x: opt.e.offsetX, y: opt.e.offsetY };
        that.changeZoom({ point, scale });
      } else {
        const e = opt.e;
        let vpt = canvas.viewportTransform;
        vpt[4] -= e.deltaX;
        vpt[5] -= e.deltaY;

        try {
          // [Sketch range limits]
          const scale = params ? params.scale : 1;
          vpt[4] = that.axisLimit({ scale, vpt: vpt[4], axis: 'x' });
          vpt[5] = that.axisLimit({ scale, vpt: vpt[5], axis: 'y' });

          // x, y coordinates used to zoom out the screen at the end of the wall (To prevent the screen from going beyond the border of the transparent wall I set when reducing the screen)
          that.nowX = vpt[4];
          that.nowY = vpt[5];
        } catch (error) {
          console.log(error);
        }

        // const boundaries = that.getCanvasContentBoundaries();

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

  // [Sketch range limits]
  axisLimit({ scale, vpt, axis }) {
    let result = vpt;
    const containerElement = this.canvasRef.current;
    if (!containerElement) {
      return vpt;
    }

    // Determined by whether it is the x-axis or y-axis
    const containerSize =
      axis === 'x' ? containerElement.offsetWidth : containerElement.offsetHeight;
    const addScroll = axis === 'x' ? this.sketchWidthLimit : this.sketchHeightLimit;

    // Range adjustment when zooming in/out
    const zoomInMinusValue = containerSize * scale - containerSize;
    const zoomOutPlusValue = containerSize * (1 - scale);

    // left || top
    if (result > addScroll * scale) {
      result = addScroll * scale;
    }

    // zoom in && right || zoom in && bottom
    else if (scale >= 1 && result < -(addScroll * scale) - zoomInMinusValue) {
      result = -(addScroll * scale) - zoomInMinusValue;
    }

    // zoom out && right || zoom out && bottom
    else if (scale < 1 && result < -(addScroll * scale) + zoomOutPlusValue) {
      result = -(addScroll * scale) + zoomOutPlusValue;
    }

    return result;
  }

  setDrawingSettings(drawingSettings) {
    if (!drawingSettings) return;

    this.drawingSettings = { ...this.drawingSettings, ...drawingSettings };
    this.setDrawingMode(this.drawingSettings.currentMode);
  }

  setCanvasConfig(canvasConfig) {
    if (!canvasConfig) return;

    this.applyCanvasConfig(canvasConfig);
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

  throttle(f, delay = 300) {
    let timer = 0;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => f.apply(this, args), delay);
    };
  }

  handleResize(callback) {
    const resize_ob = new ResizeObserver(this.throttle(callback, 300));
    return resize_ob;
  }

  resizeCanvas(canvas, whiteboard) {
    return function () {
      const width = whiteboard.clientWidth;
      const height = whiteboard.clientHeight;
      this.changeZoom({ scale: 1 });
      // const scale = width / canvas.getWidth();
      // const zoom = canvas.getZoom() * scale;
      canvas.setDimensions({ width: width, height: height });
      // canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    };
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
      console.log(hoveredObject);
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
    canvas.selection = true;

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
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
  }

  changeZoom({ point, scale }) {
    if (!point) {
      const width = this.canvas.width;
      const height = this.canvas.height;
      point = { x: width / 2, y: height / 2 };
    }

    const minZoom = this.canvasConfig.minZoom;
    const maxZoom = this.canvasConfig.maxZoom;

    scale = this.canvas.getZoom() * scale;
    scale = scale < minZoom ? minZoom : scale > maxZoom ? maxZoom : scale;

    this.canvas.zoomToPoint(point, scale);
    this.onZoom({ point, scale });

    // [Sketch range limits] Modified so that when the screen is reduced while reaching the end of the wall, it does not go beyond the border of the transparent wall that I set.
    // if(scale < 1) {
    //   const newVpt = this.canvas.viewportTransform;
    //   newVpt[4] = this.axisLimit({ scale, vpt: this.nowX, axis: "x" });
    //   newVpt[5] = this.axisLimit({ scale, vpt: this.nowY, axis: "y" });
    // }
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
    this.addZoomListeners(params);
    this.canvas.fire('zoom:change', params);
  }

  openPage(page) {
    const canvas = this.canvas;
    const center = canvas.getCenter();

    fabric.Image.fromURL(page, (img) => {
      if (img.width > img.height) {
        img.scaleToWidth(canvas.width);
      } else {
        img.scaleToHeight(canvas.height - 100);
      }
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        top: center.top,
        left: center.left,
        originX: 'center',
        originY: 'center',
      });

      canvas.renderAll();
    });
  }

  getCanvasContentBoundaries() {
    const canvas = this.canvas;
    const objects = canvas.getObjects();

    // Initialize variables for min and max coordinates
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    // Iterate through objects to find minimum and maximum coordinates

    for (const object of objects) {
      const objectBoundingBox = object.getBoundingRect();

      minX = Math.min(minX, objectBoundingBox.left);
      minY = Math.min(minY, objectBoundingBox.top);
      maxX = Math.max(maxX, objectBoundingBox.left + objectBoundingBox.width);
      maxY = Math.max(maxY, objectBoundingBox.top + objectBoundingBox.height);
    }

    // Calculate canvas size based on content
    const width = maxX - minX;
    const height = maxY - minY;

    return { minX, minY, maxX, maxY, width, height };
  }

  removeBoard() {
    this.element.disconnect();
    if (this.canvas) {
      this.canvas.off();
      this.canvas.dispose();
    }
    this.canvas = null;
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
