import { Canvas as FabricCanvas } from 'fabric';

export interface FileInfo {
  file: {
    name: string;
    [key: string]: any;
  };
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
