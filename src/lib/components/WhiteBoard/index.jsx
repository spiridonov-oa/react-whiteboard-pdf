import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  WhiteBoardS,
  ButtonS,
  ToolbarS,
  ZoomBarS,
  ColorBarS,
  ToolbarItemS,
  RangeInputS,
  ColorButtonS,
  SeparatorS,
  ToolbarHolderS,
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

const initFileInfo = {
  file: { name: 'Desk 1' },
  totalPages: 1,
  currentPageNumber: 0,
  currentPage: '',
};

const initDrawingSettings = {
  brushWidth: 5,
  currentMode: 'PENCIL',
  currentColor: '#000000',
  brushWidth: 5,
  fill: false,
  // background: true,
};

const initSettings = {
  zoom: 1,
  contentJSON: null,
};

const Whiteboard = ({
  controls = {},
  settings = {},
  drawingSettings = {},
  fileInfo = {},
  onObjectAdded = (data, event, canvas) => {},
  onObjectRemoved = (data, event, canvas) => {},
  onZoom = (data, event, canvas) => {},
  onImageUploaded = (data, event, canvas) => {},
  onPDFUploaded = (data, event, canvas) => {},
  onPDFUpdated = (data, event, canvas) => {},
  onPageChange = (data, event, canvas) => {},
  onOptionsChange = (data, event, canvas) => {},
  onSaveCanvasAsImage = (data, event, canvas) => {},
  onLoadFromJSON = (data, event, canvas) => {},
  onSaveCanvasState = (data, event, canvas) => {},
}) => {
  const [canvas, setCanvas] = useState(null);
  const [board, setBoard] = useState();
  const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const [canvasDrawingSettings, setCanvasDrawingSettings] = useState({
    ...initDrawingSettings,
    ...drawingSettings,
  });
  const [canvasSettings, setCanvasSettings] = useState({ ...initSettings, ...settings });
  const [fileReaderInfo, setFileReaderInfo] = useState({ ...initFileInfo, ...fileInfo });
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
        COLOR_PICKER: true,
        DEFAULT_COLORS: true,
        FILES: true,
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
      drawingSettings: canvasDrawingSettings,
      canvasSettings: canvasSettings,
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
    if (!canvas || !canvasSettings.contentJSON) return;

    canvas.loadFromJSON(canvasSettings.contentJSON);
    onLoadFromJSON(canvasSettings.contentJSON, null, canvas);
  }, [canvas, canvasSettings.contentJSON]);

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

    canvas.on('zoom', function (data) {
      onZoom(data, null, canvas);
      setCanvasSettings({ ...canvasSettings, zoom: data.scale });
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

    board.setDrawingSettings(canvasDrawingSettings);
  }, [canvasDrawingSettings, board]);

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
    const newOptions = { ...canvasDrawingSettings, brushWidth: intValue };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeMode(mode, e) {
    if (canvasDrawingSettings.currentMode === mode) return;
    const newOptions = { ...canvasDrawingSettings, currentMode: mode };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeCurrentColor(color, e) {
    canvas.freeDrawingBrush.color = color;
    const newOptions = { ...canvasDrawingSettings, currentColor: color };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function changeFill(e) {
    const newOptions = { ...canvasDrawingSettings, fill: !canvasDrawingSettings.fill };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, canvas);
  }

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      saveAs(blob, `${fileReaderInfo.file.name}_page-${fileReaderInfo.currentPage}.png`);
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

  const handleZoomIn = () => {
    board.changeZoom({ scale: 1.1 });
  };

  const handleZoomOut = () => {
    board.changeZoom({ scale: 0.9 });
  };

  const handleResetZoom = () => {
    board.resetZoom(1);
  };

  const getColorButtons = (colors) => {
    return colors.map((color) => (
      <ToolbarItemS key={color}>
        <ColorButtonS color={color} onClick={(e) => changeCurrentColor(color, e)} />
      </ToolbarItemS>
    ));
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
          className={`${canvasDrawingSettings.currentMode === buttonKey ? 'selected' : ''}`}
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
        <ColorBarS>
          {!!enabledControls.COLOR_PICKER && (
            <ToolbarItemS>
              <ColorPicker
                size={28}
                color={canvasDrawingSettings.currentColor}
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
                thumbColor={canvasDrawingSettings.currentColor}
                value={canvasDrawingSettings.brushWidth}
                onChange={changeBrushWidth}
              />
            </ToolbarItemS>
          )}
          {!!enabledControls.DEFAULT_COLORS && (
            <>{getColorButtons(['#6161ff', '#ff4f4f', '#3fd18d', '#ec70ff', '#000000'])}</>
          )}
          {!!enabledControls.FILL && (
            <ButtonS
              type="button"
              className={canvasDrawingSettings.fill ? 'selected' : ''}
              onClick={changeFill}
            >
              <img src={FillIcon} alt="Delete" />
            </ButtonS>
          )}
        </ColorBarS>
        <ToolbarS>
          {getControls()}

          {!!enabledControls.CLEAR && (
            <ButtonS type="button" onClick={() => board.clearCanvas()}>
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
        </ToolbarS>
        <ZoomBarS>
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
                {Math.floor(canvasSettings.zoom * 100)}%
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
        </ZoomBarS>
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
