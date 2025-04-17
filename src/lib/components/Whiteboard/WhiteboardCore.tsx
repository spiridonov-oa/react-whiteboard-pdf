import React, { useState, useRef, useEffect, useMemo } from 'react';
// Add these two imports for react-pdf text layer support
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

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
import { PdfReader } from '../PdfReader/index';
import { saveAs } from 'file-saver';
import { Board, modes } from './Board.Class';
import { ColorPicker } from '../ColorPicker';

import SelectIcon from './../images/cursor.svg';
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
import { FileInfo, DrawingSettings, TabState, PageData } from '../../../types/config';
import { Canvas as FabricCanvas } from 'fabric';

const fn: any = () => {};
const defaultFunction = (data, event, canvas) => {};
interface WhiteboardProps {
  controls?: {
    TABS?: boolean;
    [key: string]: any;
  };
  fileInfo: FileInfo;
  activeTabState: TabState;
  contentJSON?: string;
  canvasRefLink: { canvas: FabricCanvas | null };
  drawingSettings: DrawingSettings;
  pageData: PageData;
  imageSlot?: File;
  documents?: Map<string, File>;
  activeTabIndex?: number;
  style: React.CSSProperties;
  onFileAdded?: (file: File) => void;
  onTabStateChange?: (state: Partial<TabState>, currentJSON: string, pageNumber: number) => void;
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
  fileInfo,
  activeTabState,
  contentJSON,
  drawingSettings,
  canvasRefLink,
  pageData,
  imageSlot,
  documents,
  activeTabIndex,
  style,
  onFileAdded,
  onTabStateChange,
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
  // const [canvasObjectsPerPage, setCanvasObjectsPerPage] = useState({});
  const canvasSettings = pageData;
  const [zoom, setZoom] = useState(canvasSettings.zoom);
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

  const applyJSON = () => {
    if (!boardRef.current) return;
    let json = contentJSON;
    if (json) {
      if (typeof json === 'string') {
        json = JSON.parse(json);
      }
      boardRef.current.applyJSON(json);
    } else {
      boardRef.current.clearCanvas();
    }
    boardRef.current.canvas.requestRenderAll();
  };

  useEffect(() => {
    if (imageSlot) {
      fileChanger(imageSlot);
    }
  }, [imageSlot]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newBoard = new Board({
      drawingSettings: drawingSettings,
      canvasConfig: canvasSettings,
      canvasRef: canvasRef,
    });
    canvasRefLink.canvas = newBoard.canvas as FabricCanvas;

    boardRef.current = newBoard;
    boardRef.current.setCanvasConfig(canvasSettings);

    addListeners(newBoard.canvas);

    return () => {
      if (newBoard) {
        newBoard.removeBoard();
      }
    };
  }, []);

  useEffect(() => {
    if (!boardRef.current || !resizedCount) return;
    boardRef.current.setCanvasConfig(canvasSettings);

    onConfigChange(canvasSettings, null, boardRef.current.canvas);
  }, [canvasSettings, resizedCount]);

  useEffect(() => {
    if (!boardRef.current || !resizedCount || !drawingSettings) return;

    boardRef.current?.setDrawingSettings(drawingSettings);
  }, [drawingSettings, boardRef.current, resizedCount]);

  const openPageTimer = useRef(null);
  useEffect(() => {
    if (!boardRef.current || !resizedCount) return;

    if (fileInfo.currentPage) {
      if (openPageTimer.current) {
        clearTimeout(openPageTimer.current);
      }
      openPageTimer.current = setTimeout(() => {
        if (!boardRef.current) return;
        boardRef.current.openPage(fileInfo.currentPage);

        boardRef.current.canvas.requestRenderAll();
      }, 100);
    }
  }, [fileInfo.fileName, fileInfo.currentPage, resizedCount]);

  useEffect(() => {
    if (!boardRef.current || !resizedCount || !pageData.viewportTransform) return;

    boardRef.current.canvas.setViewportTransform(pageData.viewportTransform);
  }, [pageData.viewportTransform, resizedCount]);

  useEffect(() => {
    if (!boardRef.current || !resizedCount || !pageData.zoom) return;

    boardRef.current.canvas.setZoom(pageData.zoom);
  }, [pageData.zoom, resizedCount]);

  useEffect(() => {
    if (!boardRef.current || !resizedCount) return;

    applyJSON();
  }, [contentJSON, resizedCount]);

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

  const addListeners = (canvas) => {
    canvas.on('after:render', (e) => {
      onCanvasRender(e, canvas);
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

    canvas.on('canvas:resized', (event) => {
      setResizedCount((p) => p + 1);
    });
  };

  const handleSaveCanvasState = () => {
    const newCanvasState = boardRef.current.canvas.toJSON();
    setCanvasSaveData((prevStates) => [...prevStates, newCanvasState]);
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
    boardRef.current.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    boardRef.current.resetZoom(1);

    boardRef.current.nowX = 0;
    boardRef.current.nowY = 0;
  };

  const onFileChange = (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (file.type.includes('image/')) {
      uploadImageFile(file);
      onImageUploaded(file, event, boardRef.current.canvas);
    } else if (file.type.includes('pdf')) {
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
          <img src={btn.icon} alt={btn.name} />
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
              <img src={FillIcon} alt="Delete" />
            </ButtonS>
          )}
        </ColorBarS>
        <ToolbarS>
          {getControls()}

          {!!enabledControls.CLEAR && (
            <ButtonS type="button" onClick={() => boardRef.current.clearCanvas()}>
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

      <PDFWrapperS>
        <PdfReader
          fileReaderInfo={fileInfo}
          //onPageChange={handlePageChange}
          updateFileReaderInfo={updateFileInfo}
        />
      </PDFWrapperS>

      <canvas
        style={{
          zIndex: 1,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        className="canvas"
        ref={canvasRef}
        id="canvas"
      />
    </WhiteBoardS>
  );
};

export default WhiteboardCore;
