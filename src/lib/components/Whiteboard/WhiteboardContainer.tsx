import React, { useState, useRef, useEffect } from 'react';
import WhiteboardCore from './WhiteboardCore';
import { TabsS, TabS } from './Whiteboard.styled.js';
import { FileInfo, DrawingSettings, CanvasSettings, TabState } from '../../../types/config';

interface WhiteboardContainerProps {
  activeTabIndex?: number;
  drawingSettings?: DrawingSettings;
  canvasSettings?: CanvasSettings;
  fileInfo?: FileInfo;
  controls?: any;
  onDocumentChanged?: (fileInfo: FileInfo, pageNumber: number, totalPages: number) => void;
  onFileAdded?: (file: File) => void;
  onTabStateChange?: (state: any) => void;
  onObjectAdded?: (data: any, event: any, canvas: any) => void;
  onObjectRemoved?: (data: any, event: any, canvas: any) => void;
  onObjectModified?: (data: any, event: any, canvas: any) => void;
  onCanvasRender?: (data: any, event: any, canvas: any) => void;
  onCanvasChange?: (data: any, event: any, canvas: any) => void;
  onZoom?: (data: any, event: any, canvas: any) => void;
  onImageUploaded?: (file: File, event: any, canvas: any) => void;
  onPDFUploaded?: (file: File, event: any, canvas: any) => void;
  onPDFUpdated?: (fileInfo: FileInfo, event: any, canvas: any) => void;
  onPageChange?: (fileInfo: FileInfo, event: any, canvas: any) => void;
  onOptionsChange?: (options: DrawingSettings, event: any, canvas: any) => void;
  onSaveCanvasAsImage?: (blob: Blob, event: any, canvas: any) => void;
  onConfigChange?: (settings: CanvasSettings, event: any, canvas: any) => void;
}

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
  fill: false,
  // background: true,
};

const initCanvasSettings = {
  zoom: 1,
  viewportTransform: [1, 0, 0, 1, 0, 0],
  contentJSON: '',
};

const WhiteboardContainer = (props) => {
  const [documents, setDocuments] = useState(
    new Map().set(initFileInfo.file.name, initFileInfo.file),
  );

  const canvasObjects = useRef(props.canvasSettings || '');

  const initTabIndex = props.activeTabIndex || 0;
  const initTabState: TabState = {
    drawingSettings: { ...initDrawingSettings, ...props.drawingSettings },
    canvasSettings: { ...initCanvasSettings, ...props.canvasSettings },
    fileInfo: { ...initFileInfo, ...props.fileInfo },
  };

  const [activeTabIndex, setActiveTabIndex] = useState(initTabIndex);
  const [currentBoardState, setCurrentBoardState] = useState(initTabState);

  const tabGlobalState = useRef(new Map([[initTabIndex, initTabState]]));

  // Handle tab state changes from props
  useEffect(() => {
    if (props.drawingSettings || props.canvasSettings || props.fileInfo) {
      setCurrentBoardState({
        ...currentBoardState,
        drawingSettings: { ...currentBoardState.drawingSettings, ...props.drawingSettings },
        canvasSettings: { ...currentBoardState.canvasSettings, ...props.canvasSettings },
        fileInfo: { ...currentBoardState.fileInfo, ...props.fileInfo },
      });
    }
  }, [props.drawingSettings, props.canvasSettings, props.fileInfo]);

  const changeDocument = (index) => {
    // tabGlobalState.current.set(activeTabIndex, {
    //   ...currentBoardState,
    //   canvasSettings: { ...currentBoardState.canvasSettings, contentJSON: canvasObjects.current },
    // });

    updateCurrentBoardState({}, activeTabIndex);

    setActiveTabIndex(index);
    const state = tabGlobalState.current.get(index);
    if (state) {
      setCurrentBoardState(state);
    }

    if (props.onDocumentChanged) {
      props.onDocumentChanged(tabGlobalState.current.get(index).fileInfo, null, null);
    }
  };

  console.log(activeTabIndex, currentBoardState.canvasSettings.contentJSON, canvasObjects.current);

  const updateCurrentBoardState = (newState: Partial<TabState>, tabIndex: number) => {
    if (newState) {
      const currentState = tabGlobalState.current.get(tabIndex);
      const drawingSettings = newState.drawingSettings
        ? newState.drawingSettings
        : currentState.drawingSettings || initDrawingSettings;
      const canvasSettings = newState.canvasSettings
        ? newState.canvasSettings
        : {
            ...(currentState.canvasSettings || initCanvasSettings),
            contentJSON: canvasObjects.current,
          };
      const fileInfo = newState.fileInfo
        ? newState.fileInfo
        : currentState.fileInfo || initFileInfo;

      const state = {
        ...currentState,
        drawingSettings: drawingSettings,
        canvasSettings: canvasSettings,
        fileInfo: fileInfo,
      };
      setCurrentBoardState(state);
      tabGlobalState.current.set(tabIndex, state);

      if (props.onOptionsChange) {
        props.onOptionsChange(state);
      }
      return state;
    } else {
      return currentBoardState;
    }
  };

  const handleAddDocument = (file) => {
    const updatedDocuments = new Map(documents);
    updatedDocuments.set(file.name, file);
    // Add new tab state
    const tabIndex = updatedDocuments.size - 1;
    updateCurrentBoardState(
      {
        fileInfo: { file, currentPageNumber: 1, currentPage: '', totalPages: 1 },
        canvasSettings: initCanvasSettings,
      },
      tabIndex,
    );

    setDocuments(updatedDocuments);
    // Set active tab to the newly added document's index
    setActiveTabIndex(tabIndex);
    if (props.onFileAdded) {
      props.onFileAdded(file);
    }
    if (props.onDocumentChanged) {
      props.onDocumentChanged({ file, currentPageNumber: 1 }, 1, 1);
    }
    if (props.onTabStateChange) {
      props.onTabStateChange(tabGlobalState.current);
    }
  };

  const handleDrawingSettingsChange = (newSettings) => {
    const state = updateCurrentBoardState({ drawingSettings: newSettings }, activeTabIndex);
    if (props.onOptionsChange) {
      props.onOptionsChange(state);
    }
  };

  const handleCanvasRender = (data, e, canvas) => {
    let json = canvas.toJSON();
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    canvasObjects.current = json;
    if (props.onOptionsChange) {
      props.onCanvasRender(data, e, canvas);
    }
  };

  return (
    <>
      {props.controls?.TABS !== false && (
        <TabsS>
          {Array.from(documents.keys()).map((document, index) => (
            <TabS
              key={index}
              onClick={() => changeDocument(index)}
              style={
                index === activeTabIndex
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

      <WhiteboardCore
        {...props}
        onDocumentChanged={props.onDocumentChanged}
        drawingSettings={currentBoardState.drawingSettings}
        canvasSettings={currentBoardState.canvasSettings}
        fileInfo={currentBoardState.fileInfo}
        onOptionsChange={handleDrawingSettingsChange}
        onFileAdded={handleAddDocument}
        onTabStateChange={(newState: Partial<TabState>) => {
          updateCurrentBoardState(newState, activeTabIndex);
          if (props.onTabStateChange) {
            props.onTabStateChange(tabGlobalState.current);
          }
        }}
        onCanvasRender={handleCanvasRender}
        onPageChange={(newState: Partial<TabState>) => {
          const state = updateCurrentBoardState(newState, activeTabIndex);
          if (props.onOptionsChange) {
            props.onOptionsChange(state);
          }
        }}
        updateCurrentBoardState={updateCurrentBoardState}
        activeTabIndex={activeTabIndex}
        documents={documents}
      />
    </>
  );
};

export default WhiteboardContainer;
