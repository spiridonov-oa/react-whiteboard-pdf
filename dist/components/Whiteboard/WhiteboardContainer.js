"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _WhiteboardCore = _interopRequireDefault(require("./WhiteboardCore"));
var _Whiteboard = require("./Whiteboard.styled");
var _utils = require("./utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getInitFileInfo = (name, file) => {
  return {
    file: file,
    fileName: name || 'New Document',
    totalPages: 1,
    currentPageNumber: 0,
    currentPage: '',
    canvas: null,
    pages: [getInitPageData()]
  };
};
const getInitPageData = initPageData => {
  return {
    contentJSON: '',
    zoom: 1,
    viewportTransform: [1, 0, 0, 1, 0, 0],
    ...initPageData
  };
};
const initDrawingSettings = {
  brushWidth: 5,
  currentMode: 'PENCIL',
  currentColor: '#000000',
  fill: false
  // background: true,
};
const WhiteboardContainer = props => {
  var _selectedTabState$fil, _props$controls;
  const initFileInfo = {
    ...getInitFileInfo('Document'),
    ...props.fileInfo
  };
  const [documents, setDocuments] = (0, _react.useState)(new Map().set(initFileInfo.fileName, initFileInfo.file));
  const initTabIndex = props.activeTabIndex || 0;
  const initTabState = {
    drawingSettings: {
      ...initDrawingSettings,
      ...props.drawingSettings
    },
    fileInfo: {
      ...initFileInfo,
      ...props.fileInfo
    }
  };
  const stateRefMap = (0, _react.useRef)(new Map([[initTabIndex, initTabState]])).current;
  const [prevTabIndex, setPrevTabIndex] = (0, _react.useState)(null);
  const [activeTabIndex, setActiveTabIndex] = (0, _react.useState)(initTabIndex);
  const [selectedTabState, setSelectedTabState] = (0, _react.useState)(initTabState);
  const [contentJSON, setContentJSON] = (0, _react.useState)((selectedTabState === null || selectedTabState === void 0 || (_selectedTabState$fil = selectedTabState.fileInfo) === null || _selectedTabState$fil === void 0 || (_selectedTabState$fil = _selectedTabState$fil.pages) === null || _selectedTabState$fil === void 0 || (_selectedTabState$fil = _selectedTabState$fil[activeTabIndex]) === null || _selectedTabState$fil === void 0 ? void 0 : _selectedTabState$fil.contentJSON) || '');
  // const contentJSON = currentTabState?.fileInfo?.currentPage
  //   ? canvasObjects.current[activeTabIndex][currentTabState.fileInfo.currentPageNumber]
  //   : '';

  const getPage = (tabIndex, pageNumber) => {
    const index = tabIndex;
    const page = pageNumber === 0 ? 0 : pageNumber || stateRefMap.get(index).fileInfo.currentPageNumber || 0;
    return stateRefMap.get(index).fileInfo.pages[page] || getInitPageData();
  };
  const getCanvasJSON = tabIndex => {
    const canvas = getCanvas(tabIndex);
    if (!canvas) {
      console.error('Canvas not found for tabIndex:', tabIndex);
      return null;
    }
    const json = canvas.toJSON();
    return json;
  };
  const getCanvas = tabIndex => {
    const index = tabIndex;
    return stateRefMap.get(index).fileInfo.canvas;
  };
  (0, _react.useEffect)(() => {
    if (props.contentJSON) {
      stateRefMap.get(activeTabIndex).fileInfo.pages[0].contentJSON = props.contentJSON;
      setContentJSON(props.contentJSON);
    }
  }, [props.contentJSON]);

  // Handle tab state changes from props
  (0, _react.useEffect)(() => {
    if (props.drawingSettings || props.fileInfo) {
      updateTabState(activeTabIndex, {
        drawingSettings: props.drawingSettings,
        fileInfo: props.fileInfo
      });
    }
  }, [props.drawingSettings, props.fileInfo]);
  const saveCanvasJSON = (tabIndex, currentPageNumber) => {
    try {
      const pageContent = getCanvasJSON(tabIndex);
      if (!pageContent) {
        console.error('No JSON data to save for tabIndex:', tabIndex);
        return;
      }
      let page = getPage(tabIndex, currentPageNumber);
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
  const updateTabState = (tabIndex, newState) => {
    if (!newState) return;
    const currentState = stateRefMap.get(tabIndex) || initTabState;
    const updatedState = {
      drawingSettings: {
        ...currentState.drawingSettings,
        ...newState.drawingSettings
      },
      fileInfo: {
        ...currentState.fileInfo,
        ...newState.fileInfo
      }
    };
    stateRefMap.set(tabIndex, updatedState);
    setSelectedTabState(updatedState);
    if (props.onTabStateChange) {
      props.onTabStateChange(stateRefMap);
    }
  };
  const changeTab = nextIndex => {
    if (nextIndex === activeTabIndex) return;
    if (nextIndex < 0 || nextIndex >= documents.size) return;

    // Save current tab's canvas state
    const currentTabState = stateRefMap.get(activeTabIndex);
    saveCanvasJSON(activeTabIndex, currentTabState.fileInfo.currentPageNumber);
    saveCanvasSettings(activeTabIndex);
    updateTabState(activeTabIndex, {
      fileInfo: currentTabState.fileInfo
    });

    // Switch to next tab
    setPrevTabIndex(activeTabIndex);
    setActiveTabIndex(nextIndex);

    // Load next tab state
    const nextTabState = stateRefMap.get(nextIndex);
    updateTabState(nextIndex, {
      fileInfo: nextTabState.fileInfo
    });
    loadPageState(nextIndex, nextTabState.fileInfo.currentPageNumber);
    if (props.onDocumentChanged) {
      const tabState = stateRefMap.get(nextIndex);
      if (tabState) {
        props.onDocumentChanged(tabState.fileInfo, null, null);
      }
    }
  };
  const createNewTab = (name, file) => {
    saveCanvasJSON(activeTabIndex, selectedTabState.fileInfo.currentPageNumber);
    updateTabState(activeTabIndex, {
      fileInfo: selectedTabState.fileInfo
    });
    const newTabIndex = documents.size;
    const updatedDocuments = new Map(documents);
    updatedDocuments.set(newTabIndex, file);
    setDocuments(updatedDocuments);
    setPrevTabIndex(activeTabIndex);
    setActiveTabIndex(newTabIndex);
    updateTabState(newTabIndex, {
      fileInfo: getInitFileInfo(name, file)
    });
    loadPageState(newTabIndex, 0);
    if (props.onDocumentChanged) {
      props.onDocumentChanged({
        file,
        currentPageNumber: 0
      }, 1, 1);
    }
    if (props.onTabStateChange) {
      props.onTabStateChange(selectedTabState);
    }
  };
  const handleAddDocument = file => {
    createNewTab(file.name || 'File', file);
    if (props.onFileAdded) {
      props.onFileAdded(file);
    }
  };
  const loadPageState = (tabIndex, pageNum) => {
    let tabState = stateRefMap.get(tabIndex);
    if (!tabState) {
      setContentJSON('');
      console.error('Tab state not found for index:', tabIndex);
      return;
    } else {
      var _tabState$fileInfo;
      const pageNumber = pageNum === 0 || pageNum ? pageNum : (tabState === null || tabState === void 0 || (_tabState$fileInfo = tabState.fileInfo) === null || _tabState$fileInfo === void 0 ? void 0 : _tabState$fileInfo.currentPageNumber) || 0;
      const page = getPage(tabIndex, pageNumber);
      const pageCanvasJSON = page === null || page === void 0 ? void 0 : page.contentJSON;
      setContentJSON(pageCanvasJSON || '');
      updateTabState(tabIndex, {
        fileInfo: {
          ...tabState.fileInfo,
          currentPageNumber: pageNumber
        }
      });
    }
  };
  const getCurrentCanvasSettings = () => {
    const canvas = getCanvas(activeTabIndex);
    if (!canvas) {
      const emptyFileInfo = getInitFileInfo('Document');
      return {
        viewportTransform: emptyFileInfo.pages[0].viewportTransform,
        zoom: emptyFileInfo.pages[0].zoom
      };
    }
    return {
      viewportTransform: canvas.viewportTransform,
      zoom: canvas.getZoom()
    };
  };
  const saveCanvasSettings = tabIndex => {
    var _fileInfo$pages;
    const pageNumber = stateRefMap.get(tabIndex).fileInfo.currentPageNumber;
    const canvasSettings = getCurrentCanvasSettings();
    const fileInfo = stateRefMap.get(tabIndex).fileInfo;
    if (!fileInfo) {
      console.error('File info not found for tabIndex:', tabIndex);
      return null;
    }
    if (!((_fileInfo$pages = fileInfo.pages) !== null && _fileInfo$pages !== void 0 && _fileInfo$pages[pageNumber])) {
      fileInfo.pages[pageNumber] = getInitPageData();
    }
    fileInfo.pages[pageNumber].viewportTransform = canvasSettings.viewportTransform;
    fileInfo.pages[pageNumber].zoom = canvasSettings.zoom;
    updateTabState(tabIndex, {
      fileInfo: fileInfo
    });
    return fileInfo;
  };
  const handleDrawingSettingsChange = (tabIndex, newSettings) => {
    saveCanvasSettings(tabIndex);
    updateTabState(tabIndex, {
      drawingSettings: newSettings
    });
    if (props.onOptionsChange) {
      props.onOptionsChange(newSettings);
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
      ...data
    };
    updateTabState(tabIndex, {
      fileInfo: newFileData,
      drawingSettings: tabState.drawingSettings
    });
    loadPageState(tabIndex, data.currentPageNumber);
    props.onPageChange && props.onPageChange(newFileData, null, null);
  };
  const handleCanvasRender = (0, _utils.throttle)(tabIndex => {
    const canvas = getCanvas(tabIndex);
    if (canvas) {
      const json = getCanvasJSON(tabIndex);
      // const page = getPage(tabIndex);
      // page.contentJSON = json;
      //canvasObjects.current[tabIndex][newState.fileInfo.currentPageNumber || 1] = json;

      props.onCanvasRender(json, {
        tabIndex: activeTabIndex,
        pageNumber: stateRefMap.get(activeTabIndex).fileInfo.currentPageNumber,
        state: stateRefMap
      }, canvas);
    }
  }, 300);
  return /*#__PURE__*/_react.default.createElement(_Whiteboard.WrapperS, null, ((_props$controls = props.controls) === null || _props$controls === void 0 ? void 0 : _props$controls.TABS) !== false && /*#__PURE__*/_react.default.createElement(_Whiteboard.TabsS, null, Array.from(stateRefMap.keys()).map(tabIndex => {
    const tabState = stateRefMap.get(tabIndex);

    // Skip rendering if the tab was removed
    if (tabState === null) {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement(_Whiteboard.TabS, {
      key: tabIndex,
      onClick: () => changeTab(tabIndex),
      style: tabIndex === activeTabIndex ? {
        backgroundColor: '#fff',
        boxShadow: 'none'
      } : {
        boxShadow: `inset 0px -5px 8px -5px rgba(0, 0, 0, 0.2)`
      }
    }, tabState.fileInfo.fileName || `Document ${tabIndex + 1}`, /*#__PURE__*/_react.default.createElement("span", {
      onClick: e => {
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
          setSelectedTabState({
            ...stateRefMap.get(activeTabIndex)
          });
        }
      },
      style: {
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
        color: '#333'
        // '&:hover': {
        //   color: '#eee',
        //   transition: 'color 0.3s ease',
        // },
      }
    }, "\xD7"));
  }), /*#__PURE__*/_react.default.createElement(_Whiteboard.TabS, {
    onClick: () => {
      createNewTab(`Document ${stateRefMap.size + 1}`);
    },
    style: {
      backgroundColor: '#fff',
      fontSize: '30px',
      lineHeight: '6px',
      padding: '0em',
      width: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: 'none'
    }
  }, "+")), Array.from(stateRefMap.keys()).map((documentName, tabIndex) => {
    const tabState = stateRefMap.get(tabIndex);
    if (!tabState) {
      return null; // Skip rendering if the tab was removed
    }
    const pageNumber = tabState.fileInfo.currentPageNumber || 0;
    const page = getPage(tabIndex, pageNumber);
    stateRefMap.get(tabIndex).fileInfo.canvas = getCanvas(tabIndex) || null;
    const canvasSettings = {
      viewportTransform: page === null || page === void 0 ? void 0 : page.viewportTransform,
      zoom: page === null || page === void 0 ? void 0 : page.zoom
    };
    return /*#__PURE__*/_react.default.createElement(_WhiteboardCore.default, (0, _extends2.default)({}, props, {
      style: {
        display: tabIndex === activeTabIndex ? 'block' : 'none'
      },
      pageData: page,
      activeTabState: selectedTabState,
      onCanvasRender: (canvas, e) => handleCanvasRender(tabIndex, canvas, e),
      contentJSON: contentJSON,
      key: tabIndex,
      canvasRefLink: stateRefMap.get(tabIndex).fileInfo,
      tabIndex: tabIndex,
      onDocumentChanged: props.onDocumentChanged,
      drawingSettings: tabState.drawingSettings,
      canvasSettings: canvasSettings,
      fileInfo: tabState.fileInfo,
      onOptionsChange: newSettings => handleDrawingSettingsChange(tabIndex, newSettings),
      onFileAdded: handleAddDocument,
      onPageChange: data => {
        handlePageChange(data, tabIndex, pageNumber);
      },
      activeTabIndex: tabIndex,
      documents: documents
    }));
  }));
};
var _default = exports.default = WhiteboardContainer;