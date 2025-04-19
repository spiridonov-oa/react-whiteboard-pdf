import { Canvas as FabricCanvas } from 'fabric';

interface WhiteboardState {
  content?: {
    json?: JSON;
    pageNumber?: number;
  };
  tabIndex: number;
  pageNumber?: number;
  fileInfo?: FileInfo;
  page?: {
    pageNumber: number;
    pageData: PageData;
  };
  tabsState?: Map<number, TabState>;
  file?: File;
}

export interface FileInfo {
  fileName: string;
  totalPages: number;
  currentPageNumber: number;
  currentPage: string;
  canvas: FabricCanvas | null;
  pages: PageData[];
}

export interface PageData {
  contentJSON: string;
  zoom: number;
  viewportTransform: number[];
}

export interface DrawingSettings {
  brushWidth: number;
  currentMode: string;
  currentColor: string;
  fill: boolean;
}

export interface TabState {
  fileInfo: FileInfo;
  drawingSettings: DrawingSettings;
}
