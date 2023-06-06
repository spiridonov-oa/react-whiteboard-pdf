import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  RangeInputS,
  WhiteBoardS,
  ButtonS,
  SeparatorS,
  ToolbarS,
  ToolbarHolderS,
  ToolbarItemS,
  PDFWrapperS,
} from './WhiteBoard.styled.js';
import { fabric } from 'fabric';
import PdfReader from '../PdfReader';
import { saveAs } from 'file-saver';
import { Board, modes } from './Board.Class.js';
import { ColorPicker } from './../ColorPicker';
import SelectIcon from './../images/cross.svg';
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
import FillIcon from './../images/color-fill.svg';

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
    // const scale = width / canvas.getWidth();
    // const zoom = canvas.getZoom() * scale;
    canvas.setDimensions({ width: width, height: height });
    // canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}

const initOptions = {
  brushWidth: 5,
  currentMode: 'PENCIL',
  currentColor: '#000000',
  brushWidth: 5,
  fill: false,
  zoom: 1,
  // background: true,
};

const Whiteboard = ({
  options = {},
  controls = {},
  initialJSON = null,
  onObjectAdded = (data, event, canvas) => {},
  onObjectRemoved = (data, event, canvas) => {},
  onZoom = (data, event, canvas) => {},
  onImageUploaded = (data, event, canvas) => {},
  onPDFUploaded = (data, event, canvas) => {},
  onPageChange = (data, event, canvas) => {},
  onOptionsChange = (data, event, canvas) => {},
  onSaveCanvasAsImage = (data, event, canvas) => {},
  onLoadFromJSON = (data, event, canvas) => {},
  onSaveCanvasState = (data, event, canvas) => {},
}) => {
  const [canvas, setCanvas] = useState(null);
  const [board, setBoard] = useState();
  const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const [canvasOptions, setCanvasOptions] = useState({ ...initOptions, ...options });
  const [fileReaderInfo, setFileReaderInfo] = useState({
    file: { name: 'Desk 1' },
    totalPages: 1,
    currentPageNumber: 0,
    currentPage: '',
  });
  const canvasRef = useRef(null);
  const whiteboardRef = useRef(null);
  const uploadPdfRef = useRef(null);

  const enabledControls = useMemo(
    function () {
      return {
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
      };
    },
    [controls],
  );

  useEffect(() => {
    const board = new Board({
      width: whiteboardRef.current.clientWidth,
      height: whiteboardRef.current.clientHeight,
      ...canvasOptions,
    });

    setCanvas(board.canvas);
    setBoard(board);

    return () => {
      if (board.canvas) {
        board.canvas.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!canvas || !initialJSON) return;

    canvas.loadFromJSON(initialJSON);
    onLoadFromJSON(initialJSON, null, canvas);
  }, [canvas, initialJSON]);

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

    canvas.on('mouse:wheel', (opt) => {
      const evt = window.event || opt.e;
      const scale = (evt.wheelDelta / 240 < 0 ? 0.9 : 1.1) * canvas.getZoom();
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, scale);
      onZoom(scale, opt, canvas);
      if (opt.e != null) opt.e.preventDefault();
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
      onObjectAdded(event.target.toJSON(), event, canvas);
    });

    canvas.on('object:removed', (event) => {
      onObjectRemoved(event.target.toJSON(), event, canvas);
    });

    return () => {
      if (!canvas) return;

      canvas.off();
      canvas.dispose();
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas || !fileReaderInfo.currentPage) {
      return;
    }

    const json = getPageJSON({
      fileName: fileReaderInfo.file.name,
      pageNumber: fileReaderInfo.currentPageNumber,
    });
    if (json) {
      canvas.loadFromJSON(json);
    } else {
      const center = canvas.getCenter();
      fabric.Image.fromURL(fileReaderInfo.currentPage, (img) => {
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
  }, [fileReaderInfo.currentPage]);

  useEffect(() => {
    if (!board) return;

    board.setOptions(canvasOptions);
  }, [canvasOptions, board]);

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

  function saveCanvasState() {
    const newValue = {
      ...canvasObjectsPerPage,
      [fileReaderInfo.file.name]: {
        ...canvasObjectsPerPage[fileReaderInfo.file.name],
        [fileReaderInfo.currentPageNumber]: canvas.toJSON(),
      },
    };
    setCanvasObjectsPerPage(newValue);
    onSaveCanvasState(newValue);
  }

  function changeBrushWidth(e) {
    const intValue = parseInt(e.target.value);
    canvas.freeDrawingBrush.width = intValue;
    const newOptions = { ...canvasOptions, brushWidth: intValue };
    setCanvasOptions(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeMode(mode, e) {
    if (canvasOptions.currentMode === mode) return;
    const newOptions = { ...canvasOptions, currentMode: mode };
    setCanvasOptions(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeCurrentColor(color, e) {
    canvas.freeDrawingBrush.color = color;
    const newOptions = { ...canvasOptions, currentColor: color };
    setCanvasOptions(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeFill(e) {
    const newOptions = { ...canvasOptions, fill: !canvasOptions.fill };
    setCanvasOptions(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      saveAs(blob, 'image.png');
      onSaveCanvasAsImage(blob, null, canvas);
    });
  }

  function onFileChange(event) {
    if (!event.target.files[0]) return;

    if (event.target.files[0].type.includes('image/')) {
      uploadImage(event);
      onImageUploaded(event.target.files[0], event, canvas);
    } else if (event.target.files[0].type.includes('pdf')) {
      saveCanvasState();
      board.clearCanvas();
      updateFileReaderInfo({ file: event.target.files[0], currentPageNumber: 1 });
      onPDFUploaded(event.target.files[0], event, canvas);
    }
  }

  function getPageJSON({ fileName, pageNumber }) {
    if (canvasObjectsPerPage[fileName] && canvasObjectsPerPage[fileName][pageNumber]) {
      return canvasObjectsPerPage[fileName][pageNumber];
    } else {
      return null;
    }
  }

  function updateFileReaderInfo(data) {
    const newFileData = { ...fileReaderInfo, ...data };
    setFileReaderInfo(newFileData);
    onPDFUpdated(newFileData, null, canvas);
  }

  const handlePageChange = (page) => {
    saveCanvasState();
    board.clearCanvas(canvas);
    setFileReaderInfo({ ...fileReaderInfo, currentPageNumber: page });
    onPageChange({ ...fileReaderInfo, currentPageNumber: page }, null, canvas);
  };

  const handleZoomIn = (e) => {
    const scale = canvas.getZoom() * 1.1;

    const width = whiteboardRef.current.clientWidth;
    const height = whiteboardRef.current.clientHeight;
    const center = { x: width / 2, y: height / 2 };

    canvas.zoomToPoint(center, scale);
    onZoom({ center, scale }, e, canvas);
  };

  const handleZoomOut = (e) => {
    const scale = canvas.getZoom() * 0.9;

    const width = whiteboardRef.current.clientWidth;
    const height = whiteboardRef.current.clientHeight;
    const center = { x: width / 2, y: height / 2 };

    canvas.zoomToPoint(center, scale);
    onZoom({ center, scale }, e, canvas);
  };

  const handleResetZoom = () => {
    const width = whiteboardRef.current.clientWidth;
    const height = whiteboardRef.current.clientHeight;
    const center = { x: width / 2, y: height / 2 };

    canvas.zoomToPoint(center, 1);
    onZoom({ center, scale: 1 }, e, canvas);
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
        <ButtonS
          key={buttonKey}
          type="button"
          className={`${canvasOptions.currentMode === buttonKey ? 'selected' : ''}`}
          onClick={(e) => changeMode(buttonKey, e)}
        >
          <img src={btn.icon} alt={btn.name} />
        </ButtonS>
      );
    });
  };

  return (
    <WhiteBoardS ref={whiteboardRef}>
      <ToolbarHolderS>
        <ToolbarS>
          {!!enabledControls.COLOR && (
            <ToolbarItemS>
              <ColorPicker
                size={28}
                color={canvasOptions.currentColor}
                onChange={changeCurrentColor}
              ></ColorPicker>
            </ToolbarItemS>
          )}
          {!!enabledControls.BRUSH && (
            <ToolbarItemS>
              <RangeInputS
                type="range"
                min={1}
                max={30}
                step={1}
                thumbColor={canvasOptions.currentColor}
                value={canvasOptions.brushWidth}
                onChange={changeBrushWidth}
              />
            </ToolbarItemS>
          )}
          {!!enabledControls.FILL && (
            <ButtonS
              type="button"
              className={canvasOptions.fill ? 'selected' : ''}
              onClick={changeFill}
            >
              <img src={FillIcon} alt="Delete" />
            </ButtonS>
          )}

          <SeparatorS />

          {getControls()}

          {!!enabledControls.CLEAR && (
            <ButtonS type="button" onClick={() => board.clearCanvas(canvas, canvasOptions)}>
              <img src={DeleteIcon} alt="Delete" />
            </ButtonS>
          )}

          <SeparatorS />

          {!!enabledControls.FILES && (
            <ToolbarItemS>
              <input
                ref={uploadPdfRef}
                hidden
                accept="image/*,.pdf"
                type="file"
                onChange={onFileChange}
              />
              <ButtonS onClick={() => uploadPdfRef.current.click()}>
                <img src={UploadIcon} alt="Delete" />
              </ButtonS>
            </ToolbarItemS>
          )}

          {!!enabledControls.SAVE_AS_IMAGE && (
            <ToolbarItemS>
              <ButtonS onClick={onSaveCanvasAsImage}>
                <img src={DownloadIcon} alt="Download" />
              </ButtonS>
            </ToolbarItemS>
          )}

          <SeparatorS />

          {!!enabledControls.ZOOM && (
            <ToolbarItemS>
              <ButtonS onClick={handleZoomIn} title="Zoom In">
                <img src={ZoomInIcon} alt="Zoom In" />
              </ButtonS>
            </ToolbarItemS>
          )}

          {!!enabledControls.ZOOM && (
            <ToolbarItemS>
              <ButtonS onClick={handleResetZoom} title="Reset Zoom">
                100%
              </ButtonS>
            </ToolbarItemS>
          )}

          {!!enabledControls.ZOOM && (
            <ToolbarItemS>
              <ButtonS onClick={handleZoomOut} title="Zoom Out">
                <img src={ZoomOutIcon} alt="Zoom Out" />
              </ButtonS>
            </ToolbarItemS>
          )}
        </ToolbarS>
      </ToolbarHolderS>

      <canvas ref={canvasRef} id="canvas" />
      <PDFWrapperS>
        <PdfReader
          fileReaderInfo={fileReaderInfo}
          onPageChange={handlePageChange}
          updateFileReaderInfo={updateFileReaderInfo}
        />
      </PDFWrapperS>
    </WhiteBoardS>
  );
};

Whiteboard.propTypes = {
  aspectRatio: PropTypes.number,
};

export default Whiteboard;
