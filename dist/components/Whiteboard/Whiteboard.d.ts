import React from 'react';
import { FileInfo, DrawingSettings, PageData, WhiteboardState } from '../../../types/config';
interface WhiteboardContainerProps {
    style?: React.CSSProperties;
    state?: WhiteboardState;
    activeTabIndex?: number;
    contentJSON?: string;
    drawingSettings?: DrawingSettings;
    fileInfo?: FileInfo;
    controls?: any;
    onDocumentChanged?: (fileInfo: FileInfo, state: WhiteboardState) => void;
    onFileAdded?: (fileData: {
        tabIndex: number;
        file: File;
    }) => void;
    onTabStateChange?: (state: WhiteboardState) => void;
    onObjectAdded?: (data: any, event: any, canvas: any) => void;
    onObjectRemoved?: (data: any, event: any, canvas: any) => void;
    onObjectModified?: (data: any, event: any, canvas: any) => void;
    onCanvasRender?: (state: WhiteboardState) => void;
    onCanvasChange?: (state: WhiteboardState) => void;
    onZoom?: (data: any, event: any, canvas: any) => void;
    onImageUploaded?: (file: File, event: any, canvas: any) => void;
    onPDFUploaded?: (file: File, event: any, canvas: any) => void;
    onPDFUpdated?: (fileInfo: FileInfo, event: any, canvas: any) => void;
    onPageChange?: (state: WhiteboardState) => void;
    onOptionsChange?: (options: DrawingSettings, state: WhiteboardState) => void;
    onSaveCanvasAsImage?: (blob: Blob, event: any, canvas: any) => void;
    onConfigChange?: (settings: PageData, event: any, canvas: any) => void;
}
declare const Whiteboard: (props: WhiteboardContainerProps) => React.JSX.Element;
export default Whiteboard;
