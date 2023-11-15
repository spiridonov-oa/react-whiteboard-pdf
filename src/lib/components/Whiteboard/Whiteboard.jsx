import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  WrapperS,
  TabsS,
  TabS,
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
} from './Whiteboard.styled.js';
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
import Recenter from './../images/focus.svg';

const initFileInfo = {
  file: { name: 'Whiteboard' },
  totalPages: 1,
  currentPageNumber: 1,
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
const defaultFunction = (data, event, canvas) => {};

const Whiteboard = ({
  controls,
  settings,
  drawingSettings,
  fileInfo,
  onObjectAdded = defaultFunction,
  onObjectRemoved = defaultFunction,
  onObjectModified = defaultFunction,
  onCanvasRender = defaultFunction,
  onCanvasChange = defaultFunction,
  onZoom = defaultFunction,
  onImageUploaded = defaultFunction,
  onPDFUploaded = defaultFunction,
  onPDFUpdated = defaultFunction,
  onPageChange = defaultFunction,
  onOptionsChange = defaultFunction,
  onSaveCanvasAsImage = defaultFunction,
  onConfigChange = defaultFunction,
  onSaveCanvasState = defaultFunction,
  onDocumentChanged = defaultFunction,
}) => {
  const [canvasSaveData, setCanvasSaveData] = useState([]);
  const [board, setBoard] = useState();
  const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const [canvasDrawingSettings, setCanvasDrawingSettings] = useState({
    ...initDrawingSettings,
    ...drawingSettings,
  });
  const canvasConfig = { ...initSettings, ...settings };
  const [documents, setDocuments] = useState(
    new Map().set(initFileInfo.file.name, initFileInfo.file),
  );
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
        GO_TO_START: true,
        SAVE_AND_LOAD: true,
        ZOOM: true,
        TABS: true,

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
      canvasRef: canvasRef,  // Sketch range limits
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
    if (!board?.canvas) {
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
  }, [fileReaderInfo?.file?.name, fileReaderInfo.currentPage]);

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

  function handleSaveCanvasState() {
    const newCanvasState = board.canvas.toJSON();
    setCanvasSaveData((prevStates) => [...prevStates, newCanvasState]);
  }

  function handleLoadCanvasState(state) {
    if (board && state) {
      board.canvas.loadFromJSON(state, () => {
        board.canvas.renderAll();
      });
    }
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
    console.log({ newValue });
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
      saveAs(
        blob,
        `${fileReaderInfo.file.name}-${fileReaderInfo.currentPageNumber ? '_page-' : ''}.png`,
      );
      onSaveCanvasAsImage(blob, null, board.canvas);
    });
  }

  function bringControlTOStartPosition() {
    board.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    board.resetZoom(1);

    board.nowX = 0;
    board.nowY = 0;
  }

  function onFileChange(event) {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (file.type.includes('image/')) {
      uploadImage(event);
      onImageUploaded(file, event, board.canvas);
    } else if (file.type.includes('pdf')) {
      saveCanvasState();
      board.clearCanvas();
      updateFileReaderInfo({ file: file, currentPageNumber: 1 });
      setDocuments((prev) => new Map(prev.set(file.name, file)));
      onPDFUploaded(file, event, board.canvas);
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

  const changeDocument = (name) => {
    bringControlTOStartPosition();
    saveCanvasState();
    board.clearCanvas(board.canvas);
    setFileReaderInfo({ file: documents.get(name), currentPageNumber: 1 });
    onDocumentChanged({ file: documents.get(name), currentPageNumber: 1 }, null, board.canvas);
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
    <WrapperS>
      {!!enabledControls.TABS && (
        <TabsS>
          {Array.from(documents.keys()).map((document, index) => (
            <TabS
              key={index} // Using index as a key if document is not unique
              onClick={() => changeDocument(document)}
              style={
                document === fileReaderInfo.file.name
                  ? {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                  : {}
              }
            >
              {document}
            </TabS>
          ))}
        </TabsS>
      )}
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

            {!!enabledControls.GO_TO_START && (
              <ToolbarItemS>
                <ButtonS onClick={bringControlTOStartPosition}>
                  <img src={Recenter} alt="Recenter" />
                </ButtonS>
              </ToolbarItemS>
            )}

            {!!enabledControls.SAVE_AND_LOAD && (
              <ToolbarItemS>
                <ButtonS type="button" onClick={handleSaveCanvasState}>
                  Save
                </ButtonS>
              </ToolbarItemS>
            )}

            {!!enabledControls.SAVE_AND_LOAD && canvasSaveData && canvasSaveData.length > 0 && (
              <ToolbarItemS>
                <ButtonS onClick={() => handleLoadCanvasState(canvasSaveData[0])}>Load</ButtonS>
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

        <canvas style={{ zIndex: 1 }} ref={canvasRef} id="canvas" />

        {!!fileReaderInfo?.file?.size && (
          <PDFWrapperS>
            <PdfReader
              fileReaderInfo={fileReaderInfo}
              onPageChange={handlePageChange}
              updateFileReaderInfo={updateFileReaderInfo}
            />
          </PDFWrapperS>
        )}
      </WhiteBoardS>
    </WrapperS>
  );
};

Whiteboard.propTypes = {
  aspectRatio: PropTypes.number,
};

export default Whiteboard;
