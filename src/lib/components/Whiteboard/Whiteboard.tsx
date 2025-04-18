import React, { useState, useRef, useEffect } from 'react';
import WhiteboardCore from './WhiteboardCore';
import { TabsS, TabS, WrapperS } from './Whiteboard.styled';
import {
  FileInfo,
  DrawingSettings,
  TabState,
  PageData,
  WhiteboardState,
} from '../../../types/config';
import { throttle } from './utils';

interface WhiteboardContainerProps {
  state?: WhiteboardState;
  activeTabIndex?: number;
  contentJSON?: string;
  drawingSettings?: DrawingSettings;
  fileInfo?: FileInfo;
  controls?: any;
  onDocumentChanged?: (fileInfo: FileInfo, state: WhiteboardState) => void;
  onFileAdded?: (file: File) => void;
  onTabStateChange?: (state: WhiteboardState) => void;
  onObjectAdded?: (data: any, event: any, canvas: any) => void;
  onObjectRemoved?: (data: any, event: any, canvas: any) => void;
  onObjectModified?: (data: any, event: any, canvas: any) => void;
  onCanvasRender?: (data: any, event: any, canvas: any) => void;
  onCanvasChange?: (data: any, event: any, canvas: any) => void;
  onZoom?: (data: any, event: any, canvas: any) => void;
  onImageUploaded?: (file: File, event: any, canvas: any) => void;
  onPDFUploaded?: (file: File, event: any, canvas: any) => void;
  onPDFUpdated?: (fileInfo: FileInfo, event: any, canvas: any) => void;
  onPageChange?: (fileInfo: FileInfo, state: WhiteboardState) => void;
  onOptionsChange?: (options: DrawingSettings, state: WhiteboardState) => void;
  onSaveCanvasAsImage?: (blob: Blob, event: any, canvas: any) => void;
  onConfigChange?: (settings: PageData, event: any, canvas: any) => void;
}

const getInitFileInfo = (name: string, file?: File): FileInfo => {
  return {
    file: file,
    fileName: name || 'New Document',
    totalPages: 1,
    currentPageNumber: 0,
    currentPage: '',
    canvas: null,
    pages: [getInitPageData()],
  };
};

const getInitPageData = (initPageData?: Partial<PageData>): PageData => {
  return {
    contentJSON: '',
    zoom: 1,
    viewportTransform: [1, 0, 0, 1, 0, 0],
    ...initPageData,
  };
};

const initDrawingSettings = {
  brushWidth: 5,
  currentMode: 'PENCIL',
  currentColor: '#000000',
  fill: false,
  // background: true,
};

const Whiteboard = (props: WhiteboardContainerProps) => {
  const initFileInfo = { ...getInitFileInfo('Document'), ...props.fileInfo };

  const [documents, setDocuments] = useState(
    new Map().set(initFileInfo.fileName, initFileInfo.file),
  );

  const initTabIndex = props.activeTabIndex || 0;
  const initTabState: TabState = {
    drawingSettings: { ...initDrawingSettings, ...props.drawingSettings },
    fileInfo: { ...initFileInfo, ...props.fileInfo },
  };

  const stateRefMap = useRef(new Map([[initTabIndex, initTabState]])).current;

  const [prevTabIndex, setPrevTabIndex] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(initTabIndex);
  const [selectedTabState, setSelectedTabState] = useState(initTabState);

  const [contentJSON, setContentJSON] = useState(
    selectedTabState?.fileInfo?.pages?.[activeTabIndex]?.contentJSON || '',
  );

  useEffect(() => {
    if (props.state) {
      const { content, tabIndex, pageNumber, page, tabsState }: WhiteboardState = props.state;
      if (!tabsState) {
        console.error('Tabs state not found in props:', props.state);
        return;
      }
      tabsState.forEach((state, index) => {
        const canvas = stateRefMap.get(index).fileInfo.canvas;
        const itemState = stateRefMap.get(index);
        stateRefMap.set(index, {
          drawingSettings: { ...itemState?.drawingSettings, ...state?.drawingSettings },
          fileInfo: {
            ...itemState?.fileInfo,
            ...state.fileInfo,
            canvas: canvas,
            pages: state.fileInfo.pages,
          },
        });
      });
      setDocuments(
        new Map(Array.from(tabsState.values()).map((state, index) => [index, state.fileInfo.file])),
      );
      setActiveTabIndex(tabIndex);
      if (content) {
        try {
          if (content.pageNumber) {
            const parsedJSON = JSON.stringify(content.json);
            stateRefMap.get(tabIndex).fileInfo.pages[content.pageNumber].contentJSON = parsedJSON;
            setContentJSON(parsedJSON);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }

      if (props.state?.fileInfo) {
        const canvas = stateRefMap.get(tabIndex).fileInfo.canvas;
        const newFileInfo = {
          ...stateRefMap.get(tabIndex).fileInfo,
          ...props.state.fileInfo,
          canvas: canvas,
        };
        stateRefMap.get(tabIndex).fileInfo = newFileInfo;
        setSelectedTabState(stateRefMap.get(tabIndex));
      } else {
        setSelectedTabState(stateRefMap.get(tabIndex));
      }

      if (pageNumber) {
        stateRefMap.get(tabIndex).fileInfo.currentPageNumber = pageNumber;
      }
      if (page) {
        const pageLink = stateRefMap.get(tabIndex).fileInfo.pages[page.pageNumber];
        if (pageLink) {
          pageLink.contentJSON = page.pageData.contentJSON || pageLink.contentJSON;
          pageLink.zoom = page.pageData.zoom || pageLink.zoom;
          pageLink.viewportTransform =
            page.pageData.viewportTransform || pageLink.viewportTransform;
        }
      }
    }
  }, [props.state]);

  const getCurrentWhiteboardState = (activeTabIndex): WhiteboardState => {
    const currentState = stateRefMap.get(activeTabIndex);
    if (!currentState) {
      console.error('Current state not found for activeTabIndex:', activeTabIndex);
      return null;
    }
    const json = currentState.fileInfo.canvas?.toJSON();
    if (!json) {
      console.error('Canvas JSON not found for activeTabIndex:', activeTabIndex);
      return null;
    }
    const state = stateRefMap.get(activeTabIndex);
    if (!state) {
      console.error('State not found for activeTabIndex:', activeTabIndex);
      return null;
    }
    const pageNumber = currentState.fileInfo.currentPageNumber;
    const pageData = currentState.fileInfo.pages[pageNumber];

    return {
      content: {
        json: json,
        pageNumber: pageNumber,
      },
      pageNumber: pageNumber,
      tabIndex: activeTabIndex,
      page: { pageNumber, pageData },
      tabsState: stateRefMap,
    };
  };

  const getPage = (tabIndex?: number, pageNumber?: number): PageData => {
    const index = tabIndex;
    const page =
      pageNumber === 0 ? 0 : pageNumber || stateRefMap.get(index).fileInfo.currentPageNumber || 0;
    return stateRefMap.get(index).fileInfo.pages[page] || getInitPageData();
  };

  const getCanvasJSON = (tabIndex: number) => {
    const canvas = getCanvas(tabIndex);
    if (!canvas) {
      console.error('Canvas not found for tabIndex:', tabIndex);
      return null;
    }
    const json = canvas.toJSON();
    return json;
  };

  const getCanvas = (tabIndex: number) => {
    const index = tabIndex;
    return stateRefMap.get(index).fileInfo.canvas;
  };

  useEffect(() => {
    if (props.contentJSON) {
      stateRefMap.get(activeTabIndex).fileInfo.pages[0].contentJSON = props.contentJSON;
      setContentJSON(props.contentJSON);
    }
  }, [props.contentJSON]);

  // Handle tab state changes from props
  useEffect(() => {
    if (props.drawingSettings || props.fileInfo) {
      updateTabState(activeTabIndex, {
        drawingSettings: props.drawingSettings,
        fileInfo: props.fileInfo,
      });
    }
  }, [props.drawingSettings, props.fileInfo]);

  const saveCanvasJSON = (tabIndex: number, currentPageNumber: number) => {
    try {
      const pageContent = getCanvasJSON(tabIndex);
      if (!pageContent) {
        console.error('No JSON data to save for tabIndex:', tabIndex);
        return;
      }

      let page: PageData = getPage(tabIndex, currentPageNumber);
      if (!page) {
        stateRefMap.get(tabIndex).fileInfo.pages[currentPageNumber] = getInitPageData();
        page = stateRefMap.get(tabIndex).fileInfo.pages[currentPageNumber];
      }
      page.contentJSON = pageContent;
      setContentJSON(pageContent);
    } catch (error) {
      console.error('Error stringifying contentJSON:', error);
      return;
    }
    //setContentJSON(jsonString);
  };

  const loadPageState = (tabIndex: number, pageNum?: number) => {
    let tabState = stateRefMap.get(tabIndex);
    if (!tabState) {
      setContentJSON('');
      console.error('Tab state not found for index:', tabIndex);
      return;
    } else {
      const pageNumber =
        pageNum === 0 || pageNum ? pageNum : tabState?.fileInfo?.currentPageNumber || 0;
      const page = getPage(tabIndex, pageNumber);
      const pageCanvasJSON = page?.contentJSON;
      setContentJSON(pageCanvasJSON || '');
      updateTabState(tabIndex, {
        fileInfo: { ...tabState.fileInfo, currentPageNumber: pageNumber },
      });
    }
  };

  const getCurrentCanvasSettings = () => {
    const canvas = getCanvas(activeTabIndex);
    if (!canvas) {
      const emptyFileInfo = getInitFileInfo('Document');
      return {
        viewportTransform: emptyFileInfo.pages[0].viewportTransform,
        zoom: emptyFileInfo.pages[0].zoom,
      };
    }
    return {
      viewportTransform: canvas.viewportTransform,
      zoom: canvas.getZoom(),
    };
  };

  const saveCanvasSettings = (tabIndex: number): FileInfo => {
    const pageNumber = stateRefMap.get(tabIndex).fileInfo.currentPageNumber;
    const canvasSettings = getCurrentCanvasSettings();
    const fileInfo = stateRefMap.get(tabIndex).fileInfo;
    if (!fileInfo) {
      console.error('File info not found for tabIndex:', tabIndex);
      return null;
    }
    if (!fileInfo.pages?.[pageNumber]) {
      fileInfo.pages[pageNumber] = getInitPageData();
    }
    fileInfo.pages[pageNumber].viewportTransform = canvasSettings.viewportTransform;
    fileInfo.pages[pageNumber].zoom = canvasSettings.zoom;

    updateTabState(tabIndex, {
      fileInfo: fileInfo,
    });
    return fileInfo;
  };

  const updateTabState = (tabIndex: number, newState: Partial<TabState>) => {
    if (!newState) return;

    const currentState = stateRefMap.get(tabIndex) || initTabState;
    const updatedState = {
      drawingSettings: {
        ...currentState.drawingSettings,
        ...newState.drawingSettings,
      },
      fileInfo: {
        ...currentState.fileInfo,
        ...newState.fileInfo,
      },
    };

    stateRefMap.set(tabIndex, updatedState);

    setSelectedTabState(updatedState);

    if (props.onTabStateChange) {
      props.onTabStateChange(getCurrentWhiteboardState(tabIndex));
    }
  };

  const changeTab = (nextIndex) => {
    if (nextIndex === activeTabIndex) return;
    if (nextIndex < 0 || nextIndex >= documents.size) return;

    // Save current tab's canvas state
    const currentTabState = stateRefMap.get(activeTabIndex);
    saveCanvasJSON(activeTabIndex, currentTabState.fileInfo.currentPageNumber);
    saveCanvasSettings(activeTabIndex);

    updateTabState(activeTabIndex, {
      fileInfo: currentTabState.fileInfo,
    });

    // Switch to next tab
    setPrevTabIndex(activeTabIndex);
    setActiveTabIndex(nextIndex);

    // Load next tab state
    const nextTabState = stateRefMap.get(nextIndex);
    updateTabState(nextIndex, {
      fileInfo: nextTabState.fileInfo,
    });

    loadPageState(nextIndex, nextTabState.fileInfo.currentPageNumber);

    const stateResponse = getCurrentWhiteboardState(nextIndex);
    if (!stateResponse) {
      console.error('State not found for nextIndex:', nextIndex);
      return;
    }
    if (props.onDocumentChanged) {
      props.onDocumentChanged(stateRefMap.get(nextIndex).fileInfo, stateResponse);
    }
  };

  const createNewTab = (name: string, file?: File) => {
    saveCanvasJSON(activeTabIndex, selectedTabState.fileInfo.currentPageNumber);
    updateTabState(activeTabIndex, {
      fileInfo: selectedTabState.fileInfo,
    });

    const newTabIndex = documents.size;
    const updatedDocuments = new Map(documents);
    updatedDocuments.set(newTabIndex, file);
    setDocuments(updatedDocuments);

    setPrevTabIndex(activeTabIndex);
    setActiveTabIndex(newTabIndex);
    updateTabState(newTabIndex, {
      fileInfo: getInitFileInfo(name, file),
    });
    loadPageState(newTabIndex, 0);

    const stateResponse = getCurrentWhiteboardState(newTabIndex);
    if (!stateResponse) {
      console.error('State not found for nextIndex:', newTabIndex);
      return;
    }
    if (props.onDocumentChanged) {
      props.onDocumentChanged(stateRefMap.get(newTabIndex).fileInfo, stateResponse);
    }
  };

  const handleAddDocument = (file) => {
    createNewTab(file.name || 'File', file);

    if (props.onFileAdded) {
      props.onFileAdded(file);
    }
  };

  const handleDrawingSettingsChange = (tabIndex, newSettings) => {
    saveCanvasSettings(tabIndex);
    updateTabState(tabIndex, { drawingSettings: newSettings });

    if (props.onOptionsChange) {
      props.onOptionsChange(newSettings, getCurrentWhiteboardState(tabIndex));
    }
  };

  const handlePageChange = (data, tabIndex, pageNumber) => {
    const tabState = stateRefMap.get(tabIndex);
    if (!tabState.fileInfo.pages[pageNumber]) {
      tabState.fileInfo.pages[pageNumber] = getInitPageData();
    }
    if (!tabState.fileInfo.pages[data.currentPageNumber]) {
      tabState.fileInfo.pages[data.currentPageNumber] = getInitPageData();
    }

    saveCanvasJSON(tabIndex, pageNumber);
    saveCanvasSettings(tabIndex);

    const newFileData = {
      ...tabState.fileInfo,
      ...data,
    };

    updateTabState(tabIndex, {
      fileInfo: newFileData,
      drawingSettings: tabState.drawingSettings,
    });
    loadPageState(tabIndex, data.currentPageNumber);

    props.onPageChange && props.onPageChange(newFileData, getCurrentWhiteboardState(tabIndex));
  };

  const handleCanvasRender = throttle((tabIndex) => {
    const canvas = getCanvas(tabIndex);
    if (canvas) {
      const json = getCanvasJSON(tabIndex);
      // const page = getPage(tabIndex);
      // page.contentJSON = json;
      //canvasObjects.current[tabIndex][newState.fileInfo.currentPageNumber || 1] = json;

      props.onCanvasRender(json, getCurrentWhiteboardState(tabIndex), canvas);
    }
  }, 300);

  return (
    <WrapperS>
      {props.controls?.TABS !== false && (
        <TabsS>
          {Array.from(stateRefMap.keys()).map((tabIndex) => {
            const tabState = stateRefMap.get(tabIndex);

            // Skip rendering if the tab was removed
            if (tabState === null) {
              return null;
            }

            return (
              <TabS
                key={tabIndex}
                onClick={() => changeTab(tabIndex)}
                style={
                  tabIndex === activeTabIndex
                    ? {
                        backgroundColor: '#fff',
                        boxShadow: 'none',
                      }
                    : { boxShadow: `inset 0px -5px 8px -5px rgba(0, 0, 0, 0.2)` }
                }
              >
                {tabState.fileInfo.fileName || `Document ${tabIndex + 1}`}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    stateRefMap.set(tabIndex, null);

                    if (tabIndex === activeTabIndex) {
                      const newActiveTabIndex = tabIndex === 0 ? 0 : tabIndex - 1;
                      if (newActiveTabIndex === prevTabIndex) {
                        setPrevTabIndex(null);
                      }
                      setActiveTabIndex(newActiveTabIndex);
                      setSelectedTabState(stateRefMap.get(newActiveTabIndex));
                      loadPageState(newActiveTabIndex);
                    } else {
                      setSelectedTabState({ ...stateRefMap.get(activeTabIndex) });
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
                    // '&:hover': {
                    //   color: '#eee',
                    //   transition: 'color 0.3s ease',
                    // },
                  }}
                >
                  &times;
                </span>
              </TabS>
            );
          })}
          <TabS
            onClick={() => {
              createNewTab(`Document ${stateRefMap.size + 1}`);
            }}
            style={{
              backgroundColor: '#fff',
              fontSize: '30px',
              lineHeight: '6px',
              padding: '0em',
              width: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'none',
            }}
          >
            +
          </TabS>
        </TabsS>
      )}

      {/* Render a WhiteboardCore for each tab, but only show the active one */}
      {Array.from(stateRefMap.keys()).map((documentName, tabIndex) => {
        const tabState = stateRefMap.get(tabIndex);
        if (!tabState) {
          return null; // Skip rendering if the tab was removed
        }

        const pageNumber = tabState.fileInfo.currentPageNumber || 0;
        const page = getPage(tabIndex, pageNumber);
        stateRefMap.get(tabIndex).fileInfo.canvas = getCanvas(tabIndex) || null;
        const canvasSettings = {
          viewportTransform: page?.viewportTransform,
          zoom: page?.zoom,
        };

        return (
          <WhiteboardCore
            {...props}
            style={{
              display: tabIndex === activeTabIndex ? 'block' : 'none',
            }}
            pageData={page}
            activeTabState={selectedTabState}
            onCanvasRender={(canvas, e) => handleCanvasRender(tabIndex, canvas, e)}
            contentJSON={contentJSON}
            key={tabIndex}
            canvasRefLink={stateRefMap.get(tabIndex).fileInfo}
            drawingSettings={tabState.drawingSettings}
            fileInfo={tabState.fileInfo}
            onOptionsChange={(newSettings) => handleDrawingSettingsChange(tabIndex, newSettings)}
            onFileAdded={handleAddDocument}
            onPageChange={(data: FileInfo) => {
              handlePageChange(data, tabIndex, pageNumber);
            }}
            activeTabIndex={tabIndex}
          />
        );
      })}
    </WrapperS>
  );
};
export default Whiteboard;
