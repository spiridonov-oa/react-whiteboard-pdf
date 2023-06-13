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
} from './Whiteboard.styled';
import { fabric } from 'fabric';
import { PdfReader } from '../PdfReader';
import { saveAs } from 'file-saver';
import { Board, modes } from './Board.Class.js';
import { ColorPicker } from '../ColorPicker';

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

const initFileInfo = {
  file: { name: 'whiteboard' },
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
  controls,
  settings,
  drawingSettings,
  fileInfo,
  onObjectAdded = (data, event, canvas) => {},
  onObjectRemoved = (data, event, canvas) => {},
  onObjectModified = (data, event, canvas) => {},
  onCanvasRender = (data, event, canvas) => {},
  onCanvasChange = (data, event, canvas) => {},
  onZoom = (data, event, canvas) => {},
  onImageUploaded = (data, event, canvas) => {},
  onPDFUploaded = (data, event, canvas) => {},
  onPDFUpdated = (data, event, canvas) => {},
  onPageChange = (data, event, canvas) => {},
  onOptionsChange = (data, event, canvas) => {},
  onSaveCanvasAsImage = (data, event, canvas) => {},
  onConfigChange = (data, event, canvas) => {},
  onSaveCanvasState = (data, event, canvas) => {},
}) => {
  const [board, setBoard] = useState();
  const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const [canvasDrawingSettings, setCanvasDrawingSettings] = useState({
    ...initDrawingSettings,
    ...drawingSettings,
  });
  const canvasConfig = { ...initSettings, ...settings };
  const [zoom, setZoom] = useState(canvasConfig.zoom);
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
    setCanvasDrawingSettings({ ...canvasDrawingSettings, ...drawingSettings });
  }, [drawingSettings]);

  useEffect(() => {
    if (!board || !canvasConfig) return;
    board.setCanvasConfig(canvasConfig);
  }, [settings]);

  useEffect(() => {
    setFileReaderInfo({ ...fileReaderInfo, ...fileInfo });
  }, [fileInfo]);

  useEffect(() => {
    if (board) {
      return;
    }

    const newBoard = new Board({
      drawingSettings: canvasDrawingSettings,
      canvasConfig: canvasConfig,
    });

    setBoard(newBoard);
    addListeners(newBoard.canvas);

    return () => {
      if (board) {
        board.removeBoard();
      }
    };
  }, [board]);

  useEffect(() => {
    if (!board || !canvasDrawingSettings) return;

    board.setDrawingSettings(canvasDrawingSettings);
  }, [canvasDrawingSettings, board]);

  // useEffect(() => {
  //   if (!board || !canvasConfig) return;

  //   board.setCanvasConfig(canvasConfig);
  //   onConfigChange(canvasConfig, null, board.canvas);
  // }, [board, canvasConfig]);

  useEffect(() => {
    if (!board?.canvas || !fileReaderInfo.currentPage) {
      return;
    }

    const json = getPageJSON({
      fileName: fileReaderInfo.file.name,
      pageNumber: fileReaderInfo.currentPageNumber,
    });
    if (json) {
      board.canvas.loadFromJSON(json);
    } else {
      board.openPage(fileReaderInfo.currentPage);
    }
  }, [fileReaderInfo.currentPage]);

  function uploadImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.addEventListener('load', () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToHeight(board.canvas.height);
        board.canvas.add(img);
      });
    });

    reader.readAsDataURL(file);
  }

  function addListeners(canvas) {
    canvas.on('after:render', (e) => {
      const data = getFullData(canvas);
      onCanvasRender(data, e, canvas);
    });

    canvas.on('zoom:change', function (data) {
      onZoom(data, null, canvas);
      setZoom(data.scale);
    });

    canvas.on('object:added', (event) => {
      onObjectAdded(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });

    canvas.on('object:removed', (event) => {
      onObjectRemoved(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });

    canvas.on('object:modified', (event) => {
      onObjectModified(event.target.toJSON(), event, canvas);
      onCanvasChange(event.target.toJSON(), event, canvas);
    });
  }

  function getFullData(canvas) {
    if (!canvas) return;

    return {
      settings: {
        contentJSON: canvas.toJSON(),
        viewportTransform: canvas.viewportTransform,
      },
      drawingSettings: canvasDrawingSettings,
      fileInfo: fileReaderInfo,
    };
  }

  function saveCanvasState() {
    const newValue = {
      ...canvasObjectsPerPage,
      [fileReaderInfo.file.name]: {
        ...canvasObjectsPerPage[fileReaderInfo.file.name],
        [fileReaderInfo.currentPageNumber]: board.canvas.toJSON(),
      },
    };
    setCanvasObjectsPerPage(newValue);
    onSaveCanvasState(newValue);
  }

  function changeBrushWidth(e) {
    const intValue = parseInt(e.target.value);
    board.canvas.freeDrawingBrush.width = intValue;
    const newOptions = { ...canvasDrawingSettings, brushWidth: intValue };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function changeMode(mode, e) {
    if (canvasDrawingSettings.currentMode === mode) return;
    const newOptions = { ...canvasDrawingSettings, currentMode: mode };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function changeCurrentColor(color, e) {
    board.canvas.freeDrawingBrush.color = color;
    const newOptions = { ...canvasDrawingSettings, currentColor: color };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function changeFill(e) {
    const newOptions = { ...canvasDrawingSettings, fill: !canvasDrawingSettings.fill };
    setCanvasDrawingSettings(newOptions);
    onOptionsChange(newOptions, e, board.canvas);
  }

  function handleSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      saveAs(blob, `${fileReaderInfo.file.name}${fileReaderInfo.currentPage ? '_page-' : ''}.png`);
      onSaveCanvasAsImage(blob, null, board.canvas);
    });
  }

  function onFileChange(event) {
    if (!event.target.files[0]) return;

    if (event.target.files[0].type.includes('image/')) {
      uploadImage(event);
      onImageUploaded(event.target.files[0], event, board.canvas);
    } else if (event.target.files[0].type.includes('pdf')) {
      saveCanvasState();
      board.clearCanvas();
      updateFileReaderInfo({ file: event.target.files[0], currentPageNumber: 1 });
      onPDFUploaded(event.target.files[0], event, board.canvas);
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
    onPDFUpdated(newFileData, null, board.canvas);
  }

  const handlePageChange = (page) => {
    saveCanvasState();
    board.clearCanvas(board.canvas);
    setFileReaderInfo({ ...fileReaderInfo, currentPageNumber: page });
    onPageChange({ ...fileReaderInfo, currentPageNumber: page }, null, board.canvas);
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
              <ButtonS onClick={handleSaveCanvasAsImage}>
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
                <span style={{ fontSize: '11px' }}>{Math.floor(zoom * 100)}%</span>
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
