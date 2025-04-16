import React, { useState, useRef, useEffect, use } from 'react';
import WhiteboardCore from './WhiteboardCore';
import { TabsS, TabS, WrapperS } from './Whiteboard.styled.js';
import { FileInfo, DrawingSettings, CanvasSettings, TabState } from '../../../types/config';

interface WhiteboardContainerProps {
  activeTabIndex?: number;
  contentJSON?: string;
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
  file: { name: 'Document 1' },
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
};

const WhiteboardContainer = (props) => {
  const [documents, setDocuments] = useState(
    new Map().set(initFileInfo.file.name, initFileInfo.file),
  );

  const canvasRef = useRef([{ canvas: null }]);
  const canvasObjects = useRef({ 0: { 1: '' } }); // Initialize with an empty object for the first tab and page

  const initTabIndex = props.activeTabIndex || 0;
  const initTabState: TabState = {
    drawingSettings: { ...initDrawingSettings, ...props.drawingSettings },
    canvasSettings: { ...initCanvasSettings, ...props.canvasSettings },
    fileInfo: { ...initFileInfo, ...props.fileInfo },
  };

  const [prevTabIndex, setPrevTabIndex] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(initTabIndex);
  const [tabsState, setTabsState] = useState(new Map([[initTabIndex, initTabState]]));

  const currentTabState = tabsState.get(activeTabIndex);

  const [contentJSON, setContentJSON] = useState(
    currentTabState?.fileInfo?.currentPage
      ? canvasObjects.current[activeTabIndex][currentTabState.fileInfo.currentPageNumber]
      : '',
  );
  // const contentJSON = currentTabState?.fileInfo?.currentPage
  //   ? canvasObjects.current[activeTabIndex][currentTabState.fileInfo.currentPageNumber]
  //   : '';

  useEffect(() => {
    if (props.contentJSON) {
      canvasObjects.current[0][1] = props.contentJSON;
      setContentJSON(props.contentJSON);
    }
  }, [props.contentJSON]);

  useEffect(() => {
    if (currentTabState?.fileInfo?.currentPageNumber) {
      const currentPageNumber = currentTabState.fileInfo.currentPageNumber;
      const pageContent = canvasObjects.current?.[activeTabIndex]?.[currentPageNumber];
      if (pageContent) {
        setContentJSON(pageContent);
      } else {
        // If no content is found, set to empty string
        setContentJSON('');
      }
    }
  }, [activeTabIndex, currentTabState?.fileInfo?.currentPage]);

  // Handle tab state changes from props
  useEffect(() => {
    if (props.drawingSettings || props.canvasSettings || props.fileInfo) {
      updateTabState(activeTabIndex, {
        drawingSettings: props.drawingSettings,
        canvasSettings: props.canvasSettings,
        fileInfo: props.fileInfo,
      });
    }
  }, [props.drawingSettings, props.canvasSettings, props.fileInfo]);

  const saveCanvasJSON = (tabIndex: number, currentPageNumber: number) => {
    try {
      const jsonString = canvasRef.current?.[tabIndex]?.canvas?.toJSON();
      if (!jsonString) {
        console.error('No JSON data to save for tabIndex:', tabIndex);
        return;
      }
      // Store canvas objects for this tab and page
      if (!canvasObjects.current[tabIndex]) {
        canvasObjects.current[tabIndex] = {};
      }
      canvasObjects.current[tabIndex][currentPageNumber] = jsonString;
      setContentJSON(jsonString);
    } catch (error) {
      console.error('Error stringifying contentJSON:', error);
      return;
    }
    //setContentJSON(jsonString);
  };

  const updateTabState = (tabIndex: number, newState: Partial<TabState>) => {
    if (!newState) return;

    setTabsState((prevState) => {
      const newTabsState = new Map(prevState);
      const currentState = prevState.get(tabIndex) || initTabState;

      const updatedState = {
        drawingSettings: {
          ...currentState.drawingSettings,
          ...newState.drawingSettings,
        },
        canvasSettings: {
          ...currentState.canvasSettings,
          ...newState.canvasSettings,
        },
        fileInfo: {
          ...currentState.fileInfo,
          ...newState.fileInfo,
        },
      };

      newTabsState.set(tabIndex, updatedState);
      return newTabsState;
    });

    if (props.onTabStateChange) {
      props.onTabStateChange(tabsState);
    }
  };

  const changeTab = (index) => {
    if (index === activeTabIndex) return;
    if (index < 0 || index >= documents.size) return;
    const currentTabState = tabsState.get(activeTabIndex);
    saveCanvasJSON(activeTabIndex, currentTabState.fileInfo.currentPageNumber);

    const tabState = tabsState.get(index);
    loadPageState(index, tabState.fileInfo.currentPageNumber);
    setPrevTabIndex(activeTabIndex);
    setActiveTabIndex(index);

    if (props.onDocumentChanged) {
      const tabState = tabsState.get(index);
      if (tabState) {
        props.onDocumentChanged(tabState.fileInfo, null, null);
      }
    }
  };

  const createNewTab = (file: File | { name: string }) => {
    const updatedDocuments = new Map(documents);
    updatedDocuments.set(file.name, file);
    setDocuments(updatedDocuments);
    saveCanvasJSON(activeTabIndex, currentTabState.fileInfo.currentPageNumber);

    const newTabIndex = updatedDocuments.size - 1;

    setPrevTabIndex(activeTabIndex);
    setActiveTabIndex(newTabIndex);
    loadPageState(newTabIndex, 1);

    updateTabState(newTabIndex, {
      fileInfo: { file, currentPageNumber: 1, currentPage: '', totalPages: 1 },
      canvasSettings: initCanvasSettings,
    });
    if (props.onDocumentChanged) {
      props.onDocumentChanged({ file, currentPageNumber: 1 }, 1, 1);
    }
    if (props.onTabStateChange) {
      props.onTabStateChange(tabsState);
    }
  };

  const handleAddDocument = (file) => {
    createNewTab(file);

    if (props.onFileAdded) {
      props.onFileAdded(file);
    }
  };

  const loadPageState = (tabIndex: number, page?: number) => {
    let tabState = tabsState.get(tabIndex);
    if (!tabState) {
      tabState = {
        drawingSettings: initDrawingSettings,
        canvasSettings: initCanvasSettings,
        fileInfo: initFileInfo,
      };
      const pageNumber = page || tabState?.fileInfo?.currentPageNumber || 1;
      const pageCanvasJSON = canvasObjects.current?.[tabIndex]?.[pageNumber];
      setContentJSON(pageCanvasJSON || '');
      updateTabState(tabIndex, {
        fileInfo: { ...tabState.fileInfo, currentPageNumber: pageNumber },
      });
    } else {
      const pageNumber = page || tabState?.fileInfo?.currentPageNumber || 1;
      const pageCanvasJSON = canvasObjects.current?.[tabIndex]?.[pageNumber];
      setContentJSON(pageCanvasJSON || '');
      updateTabState(tabIndex, {
        fileInfo: { ...tabState.fileInfo, currentPageNumber: pageNumber },
      });
    }
  };

  const handleDrawingSettingsChange = (tabIndex, newSettings) => {
    updateTabState(tabIndex, { drawingSettings: newSettings });

    if (props.onOptionsChange) {
      props.onOptionsChange(newSettings);
    }
  };

  return (
    <WrapperS>
      {props.controls?.TABS !== false && (
        <TabsS>
          {Array.from(documents.keys()).map((document, index) => {
            if (documents.get(document) === null) {
              return null;
            }
            return (
              <TabS
                key={index}
                onClick={() => changeTab(index)}
                style={
                  index === activeTabIndex
                    ? {
                        backgroundColor: '#fff',
                        boxShadow: 'none',
                      }
                    : { boxShadow: `inset 0px -10px 10px -8px rgba(0, 0, 0, 0.2)` }
                }
              >
                {document}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedDocuments = new Map(documents);
                    updatedDocuments.set(document, null);
                    setDocuments(updatedDocuments);
                    tabsState.set(index, null);
                    setTabsState(new Map(tabsState));
                    canvasObjects.current[index] = {};
                    canvasRef.current[index] = { canvas: null };

                    if (index === activeTabIndex) {
                      const newActiveTabIndex = index === 0 ? 0 : index - 1;
                      if (newActiveTabIndex === prevTabIndex) {
                        setPrevTabIndex(null);
                      }
                      setActiveTabIndex(newActiveTabIndex);
                      loadPageState(newActiveTabIndex, 1);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '1px',
                    transform: 'translateY(-50%)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '26px',
                    height: '100%',
                    lineHeight: '12px',
                    marginLeft: '5px',
                    cursor: 'pointer',
                    color: '#333',
                  }}
                >
                  &times;
                </span>
              </TabS>
            );
          })}
          <TabS
            onClick={() => {
              createNewTab({ name: `Document ${documents.size + 1}` });
            }}
            style={{
              backgroundColor: '#fff',
              fontSize: '30px',
              lineHeight: '6px',
              padding: '0.7em',
            }}
          >
            +
          </TabS>
        </TabsS>
      )}

      {/* Render a WhiteboardCore for each tab, but only show the active one */}
      {Array.from(tabsState.keys()).map((tabIndex) => {
        if (tabsState.get(tabIndex) === null) {
          // Closed tab
          return null;
        }
        // if (tabIndex !== activeTabIndex && tabIndex !== prevTabIndex) {
        //   //canvasRef.current[tabIndex] = { canvas: null };
        // }
        const tabState = tabsState.get(tabIndex);
        const pageNumber = tabState.fileInfo?.currentPageNumber || 1;
        canvasRef.current[tabIndex] = canvasRef.current[tabIndex] || { canvas: null };

        return (
          <WhiteboardCore
            {...props}
            style={{
              display: tabIndex === activeTabIndex ? 'block' : 'none',
            }}
            contentJSON={contentJSON}
            key={tabIndex}
            canvasRefLink={canvasRef.current[tabIndex]}
            tabIndex={tabIndex}
            onDocumentChanged={props.onDocumentChanged}
            drawingSettings={tabState.drawingSettings}
            canvasSettings={tabState.canvasSettings}
            fileInfo={tabState.fileInfo}
            onOptionsChange={(newSettings) => handleDrawingSettingsChange(tabIndex, newSettings)}
            onFileAdded={handleAddDocument}
            onPageChange={(data: FileInfo) => {
              saveCanvasJSON(tabIndex, pageNumber);

              const newFileData = {
                ...tabState.fileInfo,
                ...data,
              };

              loadPageState(tabIndex, data.currentPageNumber);
              updateTabState(tabIndex, {
                fileInfo: newFileData,
              });

              props.onPageChange && props.onPageChange(newFileData, null, null);
            }}
            activeTabIndex={tabIndex}
            documents={documents}
          />
        );
      })}
    </WrapperS>
  );
};
export default WhiteboardContainer;
