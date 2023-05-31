import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import PdfReader from '../PdfReader';
import { saveAs } from 'file-saver';
import getCursor from './cursors';
import SelectIcon from './../images/select.svg';
import EraserIcon from './../images/eraser.svg';
import TextIcon from './../images/text.svg';
import RectangleIcon from './../images/rectangle.svg';
import LineIcon from './../images/line.svg';
import EllipseIcon from './../images/ellipse.svg';
import TriangleIcon from './../images/triangle.svg';
import PencilIcon from './../images/pencil.svg';
import DeleteIcon from './../images/delete.svg';
import ZoomInIcon from './../images/zoom-in.svg';
import ZoomOutIcon from './../images/zoom-out.svg';
import DownloadIcon from './../images/download.svg';
import UploadIcon from './../images/add-photo.svg';

import styles from './index.module.scss';

let drawInstance = null;
let origX;
let origY;
let mouseDown = false;

const modes = {
  PENCIL: 'PENCIL',
  LINE: 'LINE',
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  ERASER: 'ERASER',
  SELECT: 'SELECT',
  TEXT: 'TEXT',
};

const initCanvas = (options) => {
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
};

const setDrawingMode = (canvas, options) => {
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
  canvas.hoverCursor = 'auto';
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
  canvas.hoverCursor = 'auto';
  canvas.isDrawingMode = false;
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddLine(canvas, options) {
  return ({ e }) => {
    mouseDown = true;

    let pointer = canvas.getPointer(e);
    drawInstance = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: options.brushWidth,
      stroke: options.currentColor,
      selectable: false,
    });

    canvas.add(drawInstance);
    canvas.requestRenderAll();
  };
}

function startDrawingLine(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      drawInstance.set({
        x2: pointer.x,
        y2: pointer.y,
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
  canvas.hoverCursor = 'auto';
  canvas.isDrawingMode = false;
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddRect(canvas, options) {
  return ({ e }) => {
    mouseDown = true;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;

    drawInstance = new fabric.Rect({
      stroke: options.currentColor,
      strokeWidth: options.brushWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
    });

    canvas.add(drawInstance);

    drawInstance.on('mousedown', (e) => {
      if (options.currentMode === modes.ERASER) {
        canvas.remove(e.target);
      }
    });
  };
}

function startDrawingRect(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY),
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
  canvas.hoverCursor = 'auto';
  canvas.isDrawingMode = false;
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddEllipse(canvas, options) {
  return ({ e }) => {
    mouseDown = true;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Ellipse({
      stroke: options.currentColor,
      strokeWidth: options.brushWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      cornerSize: 7,
      objectCaching: false,
      selectable: false,
    });

    canvas.add(drawInstance);
  };
}

function startDrawingEllipse(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        rx: Math.abs(pointer.x - origX) / 2,
        ry: Math.abs(pointer.y - origY) / 2,
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
  canvas.hoverCursor = 'auto';
  canvas.isDrawingMode = false;
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddTriangle(canvas, options) {
  return ({ e }) => {
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Triangle({
      stroke: options.currentColor,
      strokeWidth: options.brushWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
    });

    canvas.add(drawInstance);
  };
}

function startDrawingTriangle(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY),
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
  return ({ e }) => {
    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    const text = new fabric.Textbox('', {
      left: origX - 10,
      top: origY - 10,
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
      canvas.on('mouse:down', addText(canvas, options));
    });
  };
}

// function changeToErasingMode(canvas, options) {
//   if (options.currentMode !== modes.ERASER) {
//     canvas.isDrawingMode = false;

//     options.currentMode = modes.ERASER;
//     canvas.hoverCursor = `url(${getCursor({ type: 'eraser' })}), default`;
//   }
// }

function onSelectMode(canvas, options) {
  options.currentMode = '';
  canvas.isDrawingMode = false;

  canvas.getObjects().map((item) => item.set({ selectable: true }));
  canvas.hoverCursor = 'all-scroll';
}

function clearCanvas(canvas, options) {
  canvas.getObjects().forEach((item) => {
    if (item !== canvas.backgroundImage) {
      canvas.remove(item);
    }
    // if (options.background) {
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
    const hoveredObject = event.target;
    if (hoveredObject) {
      hoveredObject.set({
        shadow: {
          color: 'red',
          blur: 6,
        },
      });
      canvas.requestRenderAll();
    }
  });

  canvas.on('mouse:out', function (event) {
    const hoveredObject = event.target;
    if (hoveredObject) {
      hoveredObject.set({
        shadow: null,
      });
      canvas.requestRenderAll();
    }
  });

  canvas.hoverCursor = `url(${getCursor({ type: 'eraser' })}), default`;
}

function canvasToJson(canvas) {
  const obj = canvas.toJSON();
  console.log(JSON.stringify(obj));
  console.log(encodeURI(JSON.stringify(obj)).split(/%..|./).length - 1);
  alert(JSON.stringify(obj));
}

function draw(canvas, options) {
  // canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = parseInt(options.brushWidth, 10) || 1;
  canvas.isDrawingMode = true;
}

function throttle(f, delay) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, args), delay);
  };
}

function handleResize(callback) {
  const resize_ob = new ResizeObserver(throttle(callback, 300));

  return resize_ob;
}

function resizeCanvas(canvas, whiteboard) {
  return () => {
    const width = whiteboard.clientWidth;
    const height = whiteboard.clientHeight;

    console.log('resizeCanvas', width, height);
    // const scale = width / canvas.getWidth();
    // const zoom = canvas.getZoom() * scale;
    canvas.setDimensions({ width: width, height: height });
    // canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}

const Whiteboard = ({
  options = {
    brushWidth: 5,
    currentMode: modes.PENCIL,
    currentColor: '#000000',
    brushWidth: 5,
    fill: false,
    // background: true,
  },
  controls = {},
  canvasJSON = null,
  onObjectAdded = () => {},
  onObjectRemoved = () => {},
}) => {
  const [canvas, setCanvas] = useState(null);
  const [canvasOptions, setCanvasOptions] = useState(options);
  const [fileReaderInfo, setFileReaderInfo] = useState({
    file: '',
    totalPages: null,
    currentPageNumber: 1,
    currentPage: '',
  });
  const canvasRef = useRef(null);
  const whiteboardRef = useRef(null);
  const uploadPdfRef = useRef(null);

  const enabledControls = useMemo(
    () => ({
      [modes.PENCIL]: true,
      [modes.LINE]: true,
      [modes.RECTANGLE]: true,
      [modes.ELLIPSE]: true,
      [modes.TRIANGLE]: true,
      [modes.TEXT]: true,
      [modes.SELECT]: true,
      [modes.ERASER]: true,
      CLEAR: true,
      FILL: true,
      BRUSH: true,
      COLOR: true,
      FILES: true,
      TO_JSON: true,
      SAVE_AS_IMAGE: true,
      ZOOM: true,

      ...controls,
    }),
    [controls],
  );

  useEffect(() => {
    const newCanvas = initCanvas({
      width: whiteboardRef.current.clientWidth,
      height: whiteboardRef.current.clientHeight,
      ...canvasOptions,
    });

    if (canvasJSON) {
      newCanvas.loadFromJSON(canvasJSON);
    }

    setCanvas(newCanvas);

    // init mode
    setDrawingMode(newCanvas, canvasOptions);
  }, [canvasJSON]);

  useEffect(() => {
    if (!canvas || !canvasJSON) return;

    canvas.loadFromJSON(canvasJSON);
  }, [canvas, canvasJSON]);

  // useEffect(() => {
  //   if (!canvas || !options.background) return;

  //   const promiseBackground = drawBackground(canvas);

  //   return () => {
  //     promiseBackground.then((bg) => {
  //       canvas.remove(bg);
  //     });
  //   };
  // }, [canvas, options.background]);

  useEffect(() => {
    if (!canvas || !whiteboardRef.current) return;

    const element = handleResize(resizeCanvas(canvas, whiteboardRef.current));
    element.observe(whiteboardRef.current);

    return () => {
      element.disconnect();
    };
  }, [canvas, whiteboardRef.current]);

  useEffect(() => {
    if (!canvas) return;

    if (canvasJSON) {
      canvas.loadFromJSON(canvasJSON);
    }
  }, [canvas, canvasJSON]);

  useEffect(() => {
    if (!canvas) return;

    canvas.on('mouse:wheel', (opt) => {
      const deltaY = opt.e.deltaY;
      const deltaX = opt.e.deltaX;
      const isVerticalScroll = Math.abs(deltaY) > Math.abs(deltaX);
      const isCanvasLargerThanViewport =
        canvas.width > canvas.viewportTransform[4] || canvas.height > canvas.viewportTransform[5];

      if (isVerticalScroll && isCanvasLargerThanViewport) {
        // Vertical scroll
        const scrollDeltaY = canvas.height / 100;
        const vertical = -scrollDeltaY * (deltaY > 0 ? 1 : -1);
        console.log(vertical);
        canvas.relativePan(new fabric.Point(0, vertical));
      } else if (!isVerticalScroll && isCanvasLargerThanViewport) {
        // Horizontal scroll
        const scrollDeltaX = canvas.width / 300;
        const horisontal = -scrollDeltaX * (deltaX > 0 ? 1 : -1);
        console.log(horisontal);
        canvas.relativePan(new fabric.Point(horisontal, 0));
      }

      opt.e.preventDefault();
      opt.e.stopPropagation();
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

          const zoomPoint = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
          };

          canvas.zoomToPoint(zoomPoint, canvas.getZoom() * zoom);
          canvas.renderAll();

          prevDistance = newDistance;
        });
      }
    });

    canvas.on('object:added', (event) => {
      console.log('object:added', event.target.toJSON());
      onObjectAdded(event, canvas);
    });

    canvas.on('object:removed', (event) => {
      console.log('object:removed', event.target.toJSON());
      onObjectRemoved(event, canvas);
    });

    return () => {
      if (!canvas) return;

      canvas.off();
    };
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      const center = canvas.getCenter();
      fabric.Image.fromURL(fileReaderInfo.currentPage, (img) => {
        if (canvas.width > canvas.height) {
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
  }, [fileReaderInfo.currentPage, canvas]);

  useEffect(() => {
    if (!canvas) return;
    setDrawingMode(canvas, canvasOptions);
  }, [canvasOptions]);

  function uploadImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.addEventListener('load', () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToHeight(canvas.height);
        canvas.add(img);
      });
    });

    reader.readAsDataURL(file);
  }

  function changeCurrentWidth(e) {
    const intValue = parseInt(e.target.value);
    canvasOptions.brushWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
    setCanvasOptions({ ...canvasOptions, brushWidth: intValue });
  }

  function changeMode(mode) {
    if (canvasOptions.currentMode === mode) return;
    const newCanvasOptions = { ...canvasOptions, currentMode: mode };
    setCanvasOptions(newCanvasOptions);
  }

  function changeCurrentColor(e) {
    canvas.freeDrawingBrush.color = e.target.value;
    setCanvasOptions({ ...canvasOptions, currentColor: e.target.value });
  }

  function changeFill(e) {
    setCanvasOptions({ ...canvasOptions, fill: e.target.checked });
  }

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      saveAs(blob, 'image.png');
    });
  }

  function onFileChange(event) {
    if (!event.target.files[0]) return;
    console.log(event.target.files[0]);

    if (event.target.files[0].type.includes('image/')) {
      uploadImage(event);
    } else if (event.target.files[0].type.includes('pdf')) {
      updateFileReaderInfo({ file: event.target.files[0], currentPageNumber: 1 });
    }
  }

  function updateFileReaderInfo(data) {
    setFileReaderInfo({ ...fileReaderInfo, ...data });
  }

  const handleZoomIn = () => {
    const scale = canvas.getZoom() * 1.1;
    canvas.setZoom(scale);
  };

  const handleZoomOut = () => {
    const scale = canvas.getZoom() / 1.1;
    canvas.setZoom(scale);
  };

  const getControls = () => {
    const modeButtons = {
      [modes.PENCIL]: { icon: PencilIcon, name: 'Pencil' },
      [modes.LINE]: { icon: LineIcon, name: 'Line' },
      [modes.RECTANGLE]: { icon: RectangleIcon, name: 'Rectangle' },
      [modes.ELLIPSE]: { icon: EllipseIcon, name: 'Ellipse' },
      [modes.TRIANGLE]: { icon: TriangleIcon, name: 'Triangle' },
      [modes.TEXT]: { icon: TextIcon, name: 'Text' },
      [modes.SELECT]: { icon: SelectIcon, name: 'Select' },
      [modes.ERASER]: { icon: EraserIcon, name: 'Eraser' },
    };

    return Object.keys(modeButtons).map((buttonKey) => {
      if (!enabledControls[buttonKey]) return;
      const btn = modeButtons[buttonKey];
      return (
        <button
          key={buttonKey}
          type="button"
          className={`${styles.toolbarButton} ${
            canvasOptions.currentMode === buttonKey ? styles.selected : ''
          }`}
          onClick={() => changeMode(buttonKey)}
        >
          <img src={btn.icon} alt={btn.name} />
        </button>
      );
    });
  };

  return (
    <div ref={whiteboardRef} className={styles.whiteboard}>
      <div className={styles.wrapper}>
        <div className={styles.toolbar}>
          <div className={styles.colorPicker}>
            <div
              style={{
                borderRadius: canvasOptions.brushWidth + 'px',
                height: canvasOptions.brushWidth + 'px',
                width: canvasOptions.brushWidth + 'px',
                background: canvasOptions.currentColor,
              }}
            ></div>
          </div>
          {!!enabledControls.COLOR && (
            <div className={styles.toolbarItem}>
              <input
                className={styles.currentColor}
                type="color"
                name="color"
                id="color"
                onChange={changeCurrentColor}
              />
            </div>
          )}
          {!!enabledControls.BRUSH && (
            <div className={styles.toolbarItem}>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={canvasOptions.brushWidth}
                onChange={changeCurrentWidth}
              />
            </div>
          )}
          {!!enabledControls.FILL && (
            <div className={styles.toolbarItem}>
              <input
                type="checkbox"
                name="fill"
                id="fill"
                checked={canvasOptions.fill}
                onChange={changeFill}
              />
              <label htmlFor="fill">fill</label>
            </div>
          )}

          <div className={styles.separator}></div>

          {getControls()}

          {!!enabledControls.CLEAR && (
            <button
              type="button"
              className={styles.toolbarButton}
              onClick={() => clearCanvas(canvas, canvasOptions)}
            >
              <img src={DeleteIcon} alt="Delete" />
            </button>
          )}

          <div className={styles.separator}></div>

          {!!enabledControls.FILES && (
            <div className={styles.toolbarItem}>
              <input
                ref={uploadPdfRef}
                hidden
                accept="image/*,.pdf"
                type="file"
                onChange={onFileChange}
              />
              <button className={styles.toolbarButton} onClick={() => uploadPdfRef.current.click()}>
                <img src={UploadIcon} alt="Delete" />
              </button>
            </div>
          )}
          {!!enabledControls.TO_JSON && (
            <div className={styles.toolbarItem}>
              <button className={styles.toolbarButton} onClick={() => canvasToJson(canvas)}>
                To JSON
              </button>
            </div>
          )}
          {!!enabledControls.SAVE_AS_IMAGE && (
            <div className={styles.toolbarItem}>
              <button className={styles.toolbarButton} onClick={onSaveCanvasAsImage}>
                <img src={DownloadIcon} alt="Download" />
              </button>
            </div>
          )}

          <div className={styles.separator}></div>

          {!!enabledControls.ZOOM && (
            <div className={styles.toolbarItem}>
              <button className={styles.toolbarButton} onClick={handleZoomIn} title="Zoom In">
                <img src={ZoomInIcon} alt="Zoom In" />
              </button>
            </div>
          )}
          {!!enabledControls.ZOOM && (
            <div className={styles.toolbarItem}>
              <button className={styles.toolbarButton} onClick={handleZoomOut} title="Zoom Out">
                <img src={ZoomOutIcon} alt="Zoom Out" />
              </button>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} id="canvas" />
      <div className={styles.pdfWrapper}>
        <PdfReader fileReaderInfo={fileReaderInfo} updateFileReaderInfo={updateFileReaderInfo} />
      </div>
    </div>
  );
};

Whiteboard.propTypes = {
  aspectRatio: PropTypes.number,
};

export default Whiteboard;
