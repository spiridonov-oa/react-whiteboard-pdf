import { Canvas, PencilBrush, Line, Rect, Ellipse, Triangle, Textbox, FabricImage } from 'fabric';
import { getCursor } from './cursors';
import { throttle } from '../utils/utils';

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
  canvasNode: HTMLElement | null = null;
  modes;
  cursorPencil = getCursor('pencil');
  mouseDown = false;
  drawInstance = null;
  drawingSettings;
  init = false;
  element: ResizeObserver | null = null;
  editedTextObject: Textbox | null = null;
  isRendered: boolean = false;

  canvasConfig = {
    zoom: 1,
    contentJSON: null,
    minZoom: 0.05,
    maxZoom: 9.99,
    viewportTransform: [1, 0, 0, 1, 50, 130],
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
      this.canvasNode = params.canvasRef.current;
      this.drawingSettings = params.drawingSettings;
    }
    this.canvas = this.initCanvas(params.canvasRef.current);

    this.canvas.once('after:render', () => {
      // if (!this.init) {
      //   this.init = true;
      //   this.applyCanvasConfig(params.canvasConfig);
      // }
    });

    if (!this.canvas) {
      console.error('Canvas initialization failed.');
      return;
    }

    this.modes = modes;
    this.resetZoom();
    this.setDrawingMode(this.drawingSettings.currentMode);
    this.addZoomListeners();
  }

  initCanvas = (canvasNode) => {
    (Canvas as any).prototype.getItemByAttr = function (attr, name) {
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

    const canvasElement = canvasNode;
    if (!canvasElement) return;

    const parentElement = canvasElement.parentNode;

    // remove canvasElement from DOM to avoid flickering
    this.canvas = new Canvas(canvasNode);

    this.canvas.perPixelTargetFind = true;

    if (parentElement) {
      const resizeCallback = this.resizeCanvas(this.canvas, parentElement).bind(this);

      // Add your custom logic to be executed after resize
      const onResizeComplete = () => {
        // For example, you might want to fire a custom event
        this.canvas.fire('canvas:resized', {
          width: this.canvas.width,
          height: this.canvas.height,
        });

        if (!this.isRendered) {
          this.isRendered = true;
          this.canvas.fire('canvas:ready');

          this.canvas.requestRenderAll();
        }
      };

      this.element = this.handleResize(resizeCallback, onResizeComplete);
      this.element.observe(parentElement);
    }

    return this.canvas;
  };

  applyCanvasConfig = (canvasConfig) => {
    if (!this.canvas || !canvasConfig) {
      return;
    }
    this.canvasConfig = { ...this.canvasConfig, ...canvasConfig };
    if (this.canvasConfig.zoom) {
      this.canvas.setZoom(this.canvasConfig.zoom);
    }

    if (this.canvasConfig.viewportTransform) {
      this.canvas.viewportTransform = this.canvasConfig.viewportTransform;
      this.changeZoom({ scale: 1 });
    }
    this.canvas.fire('config:change');

    this.canvas.defaultCursor = this.cursorPencil;
    this.canvas.hoverCursor = this.cursorPencil;

    // Notify about viewport change when config is applied
    this.fireViewportChangeEvent({
      viewportTransform: this.canvas.viewportTransform,
      zoom: this.canvas.getZoom(),
    });
  };

  applyJSON = (json) => {
    if (!this.canvas) {
      console.error('Canvas not initialized in applyJSON');
      return;
    }

    try {
      // Parse JSON if it's a string
      const jsonData = typeof json === 'string' ? JSON.parse(json) : json;

      // Clear the canvas first to prevent any conflicts
      this.canvas.clear();

      const callback = this.debounce(() => {
        if (!this.canvas) return;
        // Process each object to ensure it's properly initialized
        this.canvas.getObjects().forEach((obj) => {
          obj.setCoords();
        });

        // Force a complete re-render
        this.canvas.requestRenderAll();

        // Notify listeners that canvas has changed
        this.canvas.fire('canvas:change');
      }, 100)();

      this.canvas.loadFromJSON(jsonData, callback, (o, object) => {
        // This optional progress callback allows custom handling per object
        console.log('Loaded object: ', object.type);
      });
    } catch (error) {
      console.error('Error applying JSON to canvas:', error);
    }
  };

  // Add a proper debounce utility method to the Board class
  debounce = (func, wait = 100) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  addZoomListeners = (params?: { scale: number }) => {
    if (!this.canvas) return;
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

          // Fire viewport change event after panning
        } catch (error) {
          console.log(error);
        }
        that.fireViewportChangeEvent({
          viewportTransform: canvas.viewportTransform,
          zoom: canvas.getZoom(),
          action: 'mouse:wheel',
        });
        canvas.requestRenderAll();
      }
    });

    canvas.on('touch:gesture', (event) => {
      if (event.e.touches && event.e.touches.length === 2) {
        const point1 = {
          x: event.e.touches[0].clientX,
          y: event.e.touches[0].clientY,
        };
        const point2 = {
          x: event.e.touches[1].clientX,
          y: event.e.touches[1].clientY,
        };

        let prevDistance = canvas.getPointerDistance(point1, point2);

        canvas.on('touch:gesture', (event) => {
          const newDistance = canvas.getPointerDistance(point1, point2);
          const zoom = newDistance / prevDistance;

          const point = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
          };

          const scale = zoom;
          this.fireViewportChangeEvent({
            ...params,
            zoom: scale,
            viewportTransform: canvas.viewportTransform,
            action: 'touch:gesture',
          });
          that.changeZoom({ point, scale });
          canvas.requestRenderAll();

          prevDistance = newDistance;
        });
      }
    });
  };

  // [Sketch range limits]
  axisLimit = ({ scale, vpt, axis }) => {
    let result = vpt;
    const containerElement = this.canvasNode;
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
  };

  setDrawingSettings = (drawingSettings) => {
    if (!drawingSettings) return;

    this.drawingSettings = { ...this.drawingSettings, ...drawingSettings };
    this.setDrawingMode(this.drawingSettings.currentMode);

    if (this.canvas) {
      // If we're not in a specific drawing mode, update all selected objects with the new color
      if (
        !this.drawingSettings.currentMode ||
        this.drawingSettings.currentMode === this.modes.SELECT
      ) {
        const activeObjects = this.canvas.getActiveObjects();

        if (activeObjects && activeObjects.length > 0) {
          activeObjects.forEach((item) => {
            // Different object types need different color settings
            if (item.type === 'textbox') {
              // For text, we only set the fill (text color)
              item.set({ fill: this.drawingSettings.currentColor });
            } else if (item.type === 'path' || item.type === 'line') {
              // For paths and lines, we set the stroke
              item.set({ stroke: this.drawingSettings.currentColor });
            } else {
              // For shapes like rectangles, triangles, and ellipses
              item.set({
                stroke: this.drawingSettings.currentColor,
                fill: this.drawingSettings.fill ? this.drawingSettings.currentColor : 'transparent',
              });
            }
          });

          // Update the canvas to reflect the changes
          this.canvas.requestRenderAll();
        }
      }

      // Fire event to notify any listeners about the settings change
      this.canvas.fire('drawingSettings:change', {
        drawingSettings: this.drawingSettings,
      });
    }
  };

  setCanvasConfig = (canvasConfig) => {
    if (!canvasConfig) return;
    this.applyCanvasConfig(canvasConfig);
  };

  setDrawingMode = (mode) => {
    if (!this.canvas) {
      return;
    }
    this.drawingSettings.currentMode = mode;
    this.resetCanvas(this.canvas);

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

  resetCanvas = (canvas) => {
    if (!canvas) return;
    this.removeCanvasListener(canvas);
    canvas.selection = false;
    canvas.isDrawingMode = false;
    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
  };

  handleResize = (callback, customCallback = null) => {
    const wrappedCallback = (...args) => {
      // Execute the original resize logic
      callback(...args);

      // Execute the custom callback if provided
      if (typeof customCallback === 'function') {
        customCallback(...args);
      }
    };

    const resize_ob = new ResizeObserver(throttle(wrappedCallback, 300));
    return resize_ob;
  };

  resizeCanvas = (canvas, whiteboard) => {
    return function () {
      if (!canvas) return;
      const width = whiteboard.clientWidth;
      const height = whiteboard.clientHeight;
      this.changeZoom({ scale: 1 });
      canvas.setDimensions({ width: width, height: height });
    };
  };

  removeCanvasListener = (canvas) => {
    if (!this.canvas) return;

    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('mouse:over');
  };

  draw = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = drawingSettings.brushWidth;
    canvas.freeDrawingBrush.color = drawingSettings.currentColor;
    canvas.isDrawingMode = true;
    canvas.freeDrawingCursor = this.cursorPencil;
  };

  createLine = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;

    canvas.on('mouse:down', this.startAddLine().bind(this));
    canvas.on('mouse:move', this.startDrawingLine().bind(this));
    canvas.on('mouse:up', this.stopDrawing.bind(this));

    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  startAddLine = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;

    canvas.defaultCursor = this.cursorPencil;
    canvas.hoverCursor = this.cursorPencil;

    return function ({ e }) {
      this.mouseDown = true;

      let pointer = canvas.getScenePoint(e);
      this.drawInstance = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: drawingSettings.brushWidth,
        stroke: drawingSettings.currentColor,
        selectable: false,
      });

      canvas.add(this.drawInstance);
      canvas.requestRenderAll();
    };
  };

  startDrawingLine = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;

    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getScenePoint(e);
        this.drawInstance.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        this.drawInstance.setCoords();
        canvas.requestRenderAll();
      }
    };
  };

  createRect = () => {
    if (!this.canvas) return;
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
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  startAddRect = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    return function ({ e }) {
      this.mouseDown = true;

      const pointer = canvas.getScenePoint(e);
      this.origX = pointer.x;
      this.origY = pointer.y;

      this.drawInstance = new Rect({
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
  };

  startDrawingRect = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getScenePoint(e);

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
        canvas.requestRenderAll();
      }
    };
  };

  stopDrawing = () => {
    this.mouseDown = false;
  };

  createEllipse = () => {
    if (!this.canvas) return;
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
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  startAddEllipse = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    return function ({ e }) {
      this.mouseDown = true;

      const pointer = canvas.getScenePoint(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new Ellipse({
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
  };

  startDrawingEllipse = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;

    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getScenePoint(e);
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
        canvas.requestRenderAll();
      }
    };
  };

  createTriangle = () => {
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
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  startAddTriangle = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    return function ({ e }) {
      this.mouseDown = true;
      drawingSettings.currentMode = this.modes.TRIANGLE;

      const pointer = canvas.getScenePoint(e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.drawInstance = new Triangle({
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
  };

  startDrawingTriangle = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    return function ({ e }) {
      if (this.mouseDown) {
        const pointer = canvas.getScenePoint(e);
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
        canvas.requestRenderAll();
      }
    };
  };

  createText = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;

    if (this.drawingSettings.currentMode !== this.modes.TEXT) {
      return;
    }

    // Set text mode cursor
    canvas.defaultCursor = 'text';
    canvas.hoverCursor = 'text';
    canvas.isDrawingMode = false;

    // Make text objects selectable in text mode
    canvas.getObjects().forEach((obj) => {
      if (obj.type === 'textbox') {
        obj.set('selectable', true);
      } else {
        obj.set('selectable', false);
      }
    });

    // Clean up previous listeners
    this.removeCanvasListener(this.canvas);

    // Handle clicks to either add new text or edit existing text
    canvas.on('mouse:down', (e) => {
      // If clicked on an existing text object, enter edit mode
      if (e.target && e.target.type === 'textbox') {
        this.editText(e.target);
      } else {
        // Otherwise create new text at click position
        this.addText(e);
      }
    });
  };

  addText = (e) => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;

    const pointer = canvas.getPointer(e.e);

    // Create a new textbox with appropriate settings
    const text = new Textbox('', {
      left: pointer.x,
      top: pointer.y,
      fontSize: drawingSettings.brushWidth * 3 + 10,
      fill: drawingSettings.currentColor,
      width: 200,
      editable: true,
      selectable: true,
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
      perPixelTargetFind: false,
      borderColor: drawingSettings.currentColor,
      cornerColor: drawingSettings.currentColor,
      keysMap: {
        13: 'exitEditing', // Enter key to finish editing
      },
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();

    // Start editing immediately
    this.editText(text);
  };

  editText = (textObject) => {
    if (!this.canvas) return;
    const canvas = this.canvas;

    // Store reference to current text being edited
    this.editedTextObject = textObject;

    // Disable mouse down event while editing
    canvas.off('mouse:down');

    // Enter edit mode
    textObject.enterEditing();

    // Make sure to focus the hidden textarea
    setTimeout(() => {
      textObject.hiddenTextarea?.focus();
    }, 50);

    // Function to handle when editing is finished
    const exitEditingHandler = () => {
      if (!this.editedTextObject) return;

      // If text is empty, remove it
      if (!this.editedTextObject.text || this.editedTextObject.text.trim() === '') {
        canvas.remove(this.editedTextObject);
      }

      this.editedTextObject = null;

      // Resume text mode
      setTimeout(() => {
        this.createText();
      }, 0);
    };

    // Listen for editing exit events
    textObject.on('editing:exited', exitEditingHandler);

    // Also handle clicking outside the text to exit editing
    canvas.once('mouse:down', (e) => {
      if (textObject.isEditing && e.target !== textObject) {
        textObject.exitEditing();
      }
    });
  };

  cancelTextEditing = () => {
    if (this.editedTextObject) {
      this.editedTextObject.exitEditing();
      this.editedTextObject = null;
    }
  };

  eraserOn = () => {
    if (!this.canvas) return;
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
  };

  onSelectMode = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;
    const drawingSettings = this.drawingSettings;
    drawingSettings.currentMode = '';
    canvas.isDrawingMode = false;
    canvas.selection = true;
    this.canvas.defaultCursor = 'auto';

    canvas.getObjects().map((item) => item.set({ selectable: true }));
    canvas.hoverCursor = 'all-scroll';

    // Remove previous event listeners to prevent duplicates
    canvas.off('mouse:down');
    canvas.off('object:selected');

    // Add click handler directly to mouse:down event for more reliable detection
    canvas.on('mouse:down', (e) => {
      if (!e.target) return;

      const obj = e.target;

      // Toggle the object's position in the stack
      if (obj.data?.layeringState === 'top') {
        // Object is at top, send it to bottom
        canvas.sendObjectToBack(obj);
        obj.data = { ...obj.data, layeringState: 'bottom' };
      } else {
        // Object is either at bottom or has no state yet, bring it to front
        canvas.bringObjectToFront(obj);
        obj.data = { ...obj.data, layeringState: 'top' };
      }

      // Ensure the canvas is refreshed
      canvas.requestRenderAll();

      // Keep the object selected after changing its position
      canvas.setActiveObject(obj);
    });
  };

  clearCanvas = () => {
    if (!this.canvas) return;
    const canvas = this.canvas;

    canvas.set('backgroundImage', null);
    canvas.requestRenderAll.bind(canvas);
    canvas.clear();
  };

  changeZoom = ({ point, scale }: { point?: { x: number; y: number }; scale: number }) => {
    if (!this.canvas) return;
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
  };

  resetZoom = () => {
    if (!this.canvas) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const point = { x: width / 2, y: height / 2 };
    const scale = 1;
    this.canvas.zoomToPoint(point, scale);
    this.onZoom({ point, scale });

    // Fire viewport change event after resetting zoom
    this.fireViewportChangeEvent({
      viewportTransform: this.canvas.viewportTransform,
      zoom: scale,
      action: 'reset',
    });
  };

  onZoom = (params) => {
    if (!this.canvas) return;
    this.addZoomListeners(params);
    this.canvas.fire('zoom:change', params);
    // Fire viewport change event after zooming
    this.fireViewportChangeEvent(params);
  };

  // Replace notifyViewportChange with fireViewportChangeEvent
  fireViewportChangeEvent = (params: any) => {
    if (!this.canvas) return;

    // Include current canvas state in params
    const fullParams = {
      ...params,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      zoom: params.zoom || this.canvas.getZoom(),
      timestamp: Date.now(),
    };

    // Save current state to canvas config
    this.canvasConfig.viewportTransform = [
      ...(params.viewportTransform || this.canvas.viewportTransform),
    ];
    this.canvasConfig.zoom = fullParams.zoom;

    // Fire the canvas event
    this.canvas.fire('viewport:change', fullParams);
  };

  openPage = (page) => {
    if (!this.canvas) return Promise.reject('Canvas not initialized');

    if (!page) {
      console.log('No page provided to openPage');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // Create a URL from the blob
      let blobUrl;
      if (typeof page === 'string' && page.startsWith('data:image')) {
        const byteString = atob(page.split(',')[1]);
        const mimeString = page.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          arrayBuffer[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: mimeString });
        blobUrl = URL.createObjectURL(blob);
      } else {
        blobUrl = URL.createObjectURL(page);
      }

      const imgObj = new Image();
      imgObj.src = blobUrl;
      imgObj.onload = (imgValue) => {
        // Revoke the URL to free memory
        if (!this.canvas || !imgObj) return;
        const img = new FabricImage(imgObj);
        if (!img) {
          reject('Failed to create fabric image');
          return;
        }

        const canvasCenter = this.canvas.getCenter();

        // Scale the image to fit the canvas while maintaining aspect ratio
        if (img.width > img.height) {
          img.scaleToWidth(this.canvas.width);
        } else {
          img.scaleToHeight(this.canvas.height - 100);
        }

        img.set({
          selectable: false,
          left: canvasCenter.left,
          top: canvasCenter.top,
          originX: 'center',
          originY: 'center',
        });
        // Set the background image with proper positioning
        this.canvas.set('backgroundImage', img);
        this.canvas.requestRenderAll();
        resolve(img);
      };

      imgObj.onerror = () => reject('Error loading image');
    });
  };

  getCanvasContentBoundaries = () => {
    if (!this.canvas) return;
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
  };

  /**
   * Public method to process an image file and add it to the canvas
   * @param {File} file - The image file to process
   * @returns {Promise<Object>} - Promise resolving to the created image object
   * @public
   */
  processImageFile = (file: File): Promise<void> => {
    if (!this.canvas) return Promise.reject('Canvas not initialized');

    if (!file || !file.type.includes('image/')) {
      return Promise.reject('Invalid file type. Please select an image.');
    }

    return new Promise((_, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!this.canvas) return;
        const imgObj = new Image();
        imgObj.src = event.target?.result as string;
        imgObj.onload = () => {
          const img = new FabricImage(imgObj);
          if (!img) {
            return;
          }
          const canvasCenter = this.canvas.getCenter();
          img.set({
            selectable: true,
            left: canvasCenter.left,
            top: canvasCenter.top,
            originX: 'center',
            originY: 'center',
          });
          img.setCoords();
          img.scaleToHeight(this.canvas.height);
          this.canvas.add(img);
          this.canvas.requestRenderAll();
        };
      };

      reader.onerror = () => reject('Error reading file');
      reader.readAsDataURL(file);
    });
  };

  removeBoard = () => {
    if (this.element) {
      this.element.disconnect();
      this.element = null;
    }

    if (!this.canvas) return;
    if (this.canvas) {
      this.canvas.off();
      this.canvas.dispose();
    }
    this.canvas = null;
  };
}
