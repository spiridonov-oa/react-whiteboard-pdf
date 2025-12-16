import React from 'react';
import '../PdfReader/TextLayer.css';
import '../PdfReader/AnnotationLayer.css';
import { FileInfo, DrawingSettings, TabState, PageData } from '../../../types/config';
import { Canvas } from 'fabric';
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
    style?: React.CSSProperties;
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
declare const WhiteboardCore: ({ controls, activeTabState, activeTabIndex, documents, fileInfo, canvasList, contentJSON, drawingSettings, pageData, imageSlot, style, onFileAdded, onObjectAdded, onObjectRemoved, onObjectModified, onCanvasRender, onCanvasChange, onZoom, onImageUploaded, onPDFUploaded, onPDFUpdated, onPageChange, onOptionsChange, onSaveCanvasAsImage, onConfigChange, }: WhiteboardProps) => React.JSX.Element;
export default WhiteboardCore;
