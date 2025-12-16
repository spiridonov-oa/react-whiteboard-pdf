import React, { useState, useRef, useEffect, useMemo } from 'react';
// Add these two imports for react-pdf text layer support
import '../PdfReader/TextLayer.css';
import '../PdfReader/AnnotationLayer.css';

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
  BoardWrapperS,
} from './Whiteboard.styled';
import { PdfReader } from '../PdfReader/index';
import { saveAs } from 'file-saver';
import { Board, modes } from '../Board/Board.Class';
import { ColorPicker } from '../ColorPicker';

import SelectIcon from './../images/cursor.svg';
import EraserIcon from './../images/eraser-icon.svg';
import TextIcon from './../images/text.svg';
import RectangleIcon from './../images/rectangle.svg';
import LineIcon from './../images/line.svg';
import EllipseIcon from './../images/ellipse.svg';
import TriangleIcon from './../images/triangle.svg';
import PencilIcon from './../images/pencil-edit.svg';
import DeleteIcon from './../images/delete.svg';
import ZoomInIcon from './../images/zoom-in.svg';
import ZoomOutIcon from './../images/zoom-out.svg';
import DownloadIcon from './../images/download.svg';
import AddFileIcon from './../images/pdf-file.svg';
import AddPhotoIcon from './../images/add-photo.svg';
import FillIcon from './../images/color-fill.svg';
import Recenter from './../images/center-focus.svg';
import { FileInfo, DrawingSettings, TabState, PageData } from '../../../types/config';
import { Canvas } from 'fabric';

const fn: any = () => {};
const defaultFunction = (data, event, canvas) => {};
interface WhiteboardProps {
  controls?: {
    TABS?: boolean;
    [key: string]: any;
  };
  activeTabState?: TabState;
  activeTabIndex?: number;
  documents?: Map<number, File>;
  fileInfo: FileInfo;
  canvasList?: React.RefObject<Map<number, Canvas>>;
  contentJSON?: string;
  drawingSettings: DrawingSettings;
  pageData: PageData;
  imageSlot?: File;
  style: React.CSSProperties;
  onFileAdded?: (file: File) => void;
  onObjectAdded?: (data: any, event: any, canvas: any) => void;
  onObjectRemoved?: (data: any, event: any, canvas: any) => void;
  onObjectModified?: (data: any, event: any, canvas: any) => void;
  onCanvasRender?: (event: any, canvas: any) => void;
  onCanvasChange?: (data: any, event: any, canvas: any) => void;
  onZoom?: (data: any, event: any, canvas: any) => void;
  onImageUploaded?: (file: File, event: any, canvas: any) => void;
  onPDFUploaded?: (file: File, event: any, canvas: any) => void;
  onPDFUpdated?: (fileInfo: FileInfo, event: any, canvas: any) => void;
  onPageChange?: (data: FileInfo) => void;
  onOptionsChange?: (options: DrawingSettings, event: any, canvas: any) => void;
  onSaveCanvasAsImage?: (blob: Blob, event: any, canvas: any) => void;
  onConfigChange?: (settings: PageData, event: any, canvas: any) => void;
}

const WhiteboardCore = ({
  controls,
  activeTabState,
  activeTabIndex,
  documents,
  fileInfo,
  canvasList,
  contentJSON,
  drawingSettings,
  pageData,
  imageSlot,
  style,
  onFileAdded,
  onObjectAdded = defaultFunction,
  onObjectRemoved = defaultFunction,
  onObjectModified = defaultFunction,
  onCanvasRender = fn,
  onCanvasChange = defaultFunction,
  onZoom = defaultFunction,
  onImageUploaded = defaultFunction,
  onPDFUploaded = defaultFunction,
  onPDFUpdated = defaultFunction,
  onPageChange,
  onOptionsChange = defaultFunction,
  onSaveCanvasAsImage = defaultFunction,
  onConfigChange = defaultFunction,
}: WhiteboardProps) => {
  const [canvasSaveData, setCanvasSaveData] = useState([]);
  const boardRef = useRef(null);
  const [resizedCount, setResizedCount] = useState(1);
  const [canvasReady, setCanvasReady] = useState(false);
  // const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const [zoom, setZoom] = useState(pageData.zoom);
  const [viewportTransform, setViewportTransform] = useState(pageData.viewportTransform);
  const canvasRef = useRef(null);
  const whiteboardRef = useRef(null);
  const uploadPdfRef = useRef(null);
  const uploadImageRef = useRef(null);

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
        SAVE_AS_IMAGE: false,
        GO_TO_START: true,
        SAVE_AND_LOAD: false,
        ZOOM: true,
        TABS: true,

        ...controls,
      };
    },
    [controls],
  );

  useEffect(() => {
    if (imageSlot) {
      fileChanger(imageSlot);
    }
  }, [imageSlot]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newBoard = new Board({
      drawingSettings: drawingSettings,
      canvasConfig: pageData,
      canvasRef: canvasRef,
    });

    canvasList.current.set(activeTabIndex, newBoard.canvas);

    boardRef.current = newBoard;
    boardRef.current.setCanvasConfig(pageData);

    addListeners(newBoard.canvas);

    return () => {
      if (newBoard) {
        newBoard.removeBoard();
      }
    };
  }, []);

  useEffect(() => {
    if (!boardRef.current || !resizedCount) return;
    boardRef.current.setCanvasConfig(pageData);

    onConfigChange(pageData, null, boardRef.current.canvas);
  }, [pageData, resizedCount]);

  useEffect(() => {
    if (!boardRef.current || !resizedCount || !drawingSettings) return;

    boardRef.current?.setDrawingSettings(drawingSettings);
  }, [drawingSettings, boardRef.current, resizedCount]);

  const applyJSON = (contentJSON) => {
    if (!boardRef.current) return;
    let json: any = contentJSON;
    if (json) {
      if (typeof json === 'string') {
        json = JSON.parse(json);
      }
      if (json.backgroundImage) {
        delete json.backgroundImage;
      }

      boardRef.current.applyJSON(json);
    } else {
      boardRef.current.clearCanvas();
    }
    boardRef.current.canvas.requestRenderAll();
  };

  useEffect(() => {
    if (!boardRef.current || !canvasReady) return;

    applyJSON(contentJSON);
  }, [contentJSON, fileInfo.currentPage, canvasReady]);

  useEffect(() => {
    if (!boardRef.current || !resizedCount || !pageData.viewportTransform) return;

    setViewportTransform(pageData.viewportTransform);
    boardRef.current.canvas.setViewportTransform(pageData.viewportTransform);
  }, [pageData.viewportTransform, resizedCount]);

  useEffect(() => {
    if (!boardRef.current || !resizedCount || !pageData.zoom) return;
    setZoom(pageData.zoom);
    boardRef.current.canvas.setZoom(pageData.zoom);
  }, [pageData.zoom, resizedCount]);

  /**
   * Handles image upload process and error handling
   * @param {Promise} uploadPromise - Promise returned from boardRef.current upload methods
   * @param {Object} metadata - Additional data for callbacks
   * @param {Event} [metadata.event] - Original event if available
   * @param {File} metadata.file - The file being uploaded
   */
  const handleImageUpload = (uploadPromise, metadata) => {
    if (!boardRef.current) return;

    uploadPromise.catch((error) => console.error('Error uploading image:', error));
  };

  const uploadImageFile = (file) => {
    if (!file) return;

    handleImageUpload(boardRef.current.processImageFile(file), { file: file });
  };

  const timerViewportChangeId = useRef(null);

  const addListeners = (canvas) => {
    canvas.on('after:render', (e) => {
      onCanvasRender(e, canvas);
    });

    canvas.on('viewport:change', function (data) {
      if (!data.viewportTransform) return;
      timerViewportChangeId.current = setTimeout(() => {
        if (!boardRef.current || !data.viewportTransform) return;
        setViewportTransform([...data.viewportTransform]);
        setZoom(data.viewportTransform?.[0]);
        onZoom(data, null, canvas);
        onConfigChange(
          {
            ...pageData,
            zoom: data.viewportTransform?.[0],
            viewportTransform: [...data.viewportTransform],
          },
          null,
          canvas,
        );
      }, 100);
    });

    canvas.on('zoom:change', function (data) {
      onZoom(data, null, canvas);
      setViewportTransform(canvas.viewportTransform);
      setZoom(data.scale);
    });

    canvas.on('object:added', (event) => {
      const json = event.target.toJSON();
      onObjectAdded(json, event, canvas);
      onCanvasChange(json, event, canvas);
      handleSaveCanvasState(json);
    });

    canvas.on('object:removed', (event) => {
      const json = event.target.toJSON();
      onObjectRemoved(json, event, canvas);
      handleSaveCanvasState(json);
      onCanvasChange(json, event, canvas);
    });

    canvas.on('object:modified', (event) => {
      const json = event.target.toJSON();
      onObjectModified(json, event, canvas);
      handleSaveCanvasState(json);
      onCanvasChange(json, event, canvas);
    });

    canvas.on('canvas:resized', (event) => {
      setResizedCount((p) => p + 1);
    });

    canvas.on('canvas:ready', (event) => {
      setCanvasReady(true);
    });
  };

  const handleSaveCanvasState = (content) => {
    setCanvasSaveData((prevStates) => [...prevStates, content].slice(-20));
  };

  const handleLoadCanvasState = (state) => {
    if (boardRef.current && state) {
      boardRef.current.canvas.loadFromJSON(state, () => {
        boardRef.current.canvas.requestRenderAll();
      });
    }
  };

  const changeBrushWidth = (e) => {
    const intValue = parseInt(e.target.value);
    boardRef.current.canvas.freeDrawingBrush.width = intValue;
    const newOptions = { ...drawingSettings, brushWidth: intValue };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };

  const changeMode = (mode, e) => {
    if (drawingSettings.currentMode === mode) return;
    const newOptions = { ...drawingSettings, currentMode: mode };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };

  const changeCurrentColor = (color, e) => {
    boardRef.current.canvas.freeDrawingBrush.color = color;
    const newOptions = { ...drawingSettings, currentColor: color };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };

  const changeFill = (e) => {
    const newOptions = { ...drawingSettings, fill: !drawingSettings.fill };
    onOptionsChange(newOptions, e, boardRef.current.canvas);
  };

  const handleSaveCanvasAsImage = () => {
    canvasRef.current.toBlob(function (blob) {
      saveAs(blob, `${fileInfo.fileName}-${fileInfo.currentPageNumber ? '_page-' : ''}.png`);
      onSaveCanvasAsImage(blob, null, boardRef.current.canvas);
    });
  };

  const bringControlTOStartPosition = () => {
    boardRef.current.canvas.viewportTransform = [1, 0, 0, 1, 50, 130];
    boardRef.current.resetZoom(1);

    boardRef.current.nowX = 0;
    boardRef.current.nowY = 0;
  };

  const onImageChange = (event) => {
    const file = event.target?.files?.[0];
    if (file?.type?.includes('image/')) {
      uploadImageFile(file);
      onImageUploaded(file, event, boardRef.current.canvas);
    }
  };

  const onPFDChange = (event) => {
    const file = event.target?.files?.[0];
    if (file?.type?.includes('pdf')) {
      // Pass to parent component to handle document addition
      onFileAdded(file);
      onPDFUploaded(file, event, boardRef.current.canvas);
    }
  };

  const fileChanger = (file) => {
    if (file.type.includes('image/')) {
      uploadImageFile(file);
    } else if (file.type.includes('pdf')) {
      // Pass to parent component to handle document addition
      onFileAdded(file);
    }
  };

  const updateFileInfo = (data: FileInfo) => {
    if (!data) return;

    onPageChange && onPageChange(data);
  };

  const handleZoomIn = () => {
    boardRef.current.changeZoom({ scale: 1.1 });
  };

  const handleZoomOut = () => {
    boardRef.current.changeZoom({ scale: 0.9 });
  };

  const handleResetZoom = () => {
    boardRef.current.resetZoom(1);
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
      [modes.SELECT]: { icon: SelectIcon, name: 'Select' },
      [modes.PENCIL]: { icon: PencilIcon, name: 'Pencil' },
      [modes.LINE]: { icon: LineIcon, name: 'Line' },
      [modes.RECTANGLE]: { icon: RectangleIcon, name: 'Rectangle' },
      [modes.ELLIPSE]: { icon: EllipseIcon, name: 'Ellipse' },
      [modes.TRIANGLE]: { icon: TriangleIcon, name: 'Triangle' },
      [modes.TEXT]: { icon: TextIcon, name: 'Text' },
      [modes.ERASER]: { icon: EraserIcon, name: 'Eraser' },
    };

    return Object.keys(modeButtons).map((buttonKey) => {
      if (!enabledControls[buttonKey]) return;
      const btn = modeButtons[buttonKey];
      return (
        <ButtonS
          key={buttonKey}
          type="button"
          className={`${drawingSettings.currentMode === buttonKey ? 'selected' : ''}`}
          onClick={(e) => changeMode(buttonKey, e)}
        >
          <img style={{ width: '22px', height: '22px' }} src={btn.icon} alt={btn.name} />
        </ButtonS>
      );
    });
  };

  return (
    <WhiteBoardS ref={whiteboardRef} style={style}>
      <ToolbarHolderS>
        <ColorBarS>
          {!!enabledControls.COLOR_PICKER && (
            <ToolbarItemS>
              <ColorPicker
                size={28}
                color={drawingSettings.currentColor}
                onChange={(color) => changeCurrentColor(color, null)}
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
                style={{ '--thumb-color': drawingSettings.currentColor } as React.CSSProperties}
                value={drawingSettings.brushWidth}
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
              className={drawingSettings.fill ? 'selected' : ''}
              onClick={changeFill}
            >
              <img style={{ width: '22px', height: '22px' }} src={FillIcon} alt="Delete" />
            </ButtonS>
          )}
        </ColorBarS>
        <ToolbarS>
          {getControls()}

          {!!enabledControls.GO_TO_START && (
            <ToolbarItemS>
              <ButtonS onClick={bringControlTOStartPosition}>
                <img style={{ width: '22px', height: '22px' }} src={Recenter} alt="Recenter" />
              </ButtonS>
            </ToolbarItemS>
          )}

          {!!enabledControls.CLEAR && (
            <ButtonS type="button" onClick={() => boardRef.current.clearCanvas()}>
              <img style={{ width: '22px', height: '22px' }} src={DeleteIcon} alt="Delete" />
            </ButtonS>
          )}

          <SeparatorS />

          {!!enabledControls.FILES && (
            <ToolbarItemS>
              <input
                ref={uploadImageRef}
                hidden
                accept="image/*"
                type="file"
                onChange={onImageChange}
              />
              <ButtonS onClick={() => uploadImageRef.current.click()}>
                <img style={{ width: '22px', height: '22px' }} src={AddPhotoIcon} alt="Delete" />
              </ButtonS>
            </ToolbarItemS>
          )}
          {!!enabledControls.FILES && (
            <ToolbarItemS>
              <input ref={uploadPdfRef} hidden accept=".pdf" type="file" onChange={onPFDChange} />
              <ButtonS onClick={() => uploadPdfRef.current.click()}>
                <img style={{ width: '22px', height: '22px' }} src={AddFileIcon} alt="Delete" />
              </ButtonS>
            </ToolbarItemS>
          )}

          {!!enabledControls.SAVE_AS_IMAGE && (
            <ToolbarItemS>
              <ButtonS onClick={handleSaveCanvasAsImage}>
                <img style={{ width: '22px', height: '22px' }} src={DownloadIcon} alt="Download" />
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
                <img style={{ width: '22px', height: '22px' }} src={ZoomInIcon} alt="Zoom In" />
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
                <img style={{ width: '22px', height: '22px' }} src={ZoomOutIcon} alt="Zoom Out" />
              </ButtonS>
            </ToolbarItemS>
          )}
        </ZoomBarS>
      </ToolbarHolderS>
      <BoardWrapperS>
        <PDFWrapperS>
          <PdfReader
            fileReaderInfo={fileInfo}
            viewportTransform={viewportTransform}
            file={documents.get(activeTabIndex)}
            //onPageChange={handlePageChange}
            updateFileReaderInfo={updateFileInfo}
          />
        </PDFWrapperS>

        <canvas
          style={{
            backgroundColor: 'transparent',
            zIndex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
            overflow: 'hidden',
          }}
          className="canvas"
          ref={canvasRef}
          id="canvas"
        />
      </BoardWrapperS>
    </WhiteBoardS>
  );
};

export default WhiteboardCore;
