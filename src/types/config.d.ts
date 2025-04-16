export interface FileInfo {
  file: {
    name: string;
    [key: string]: any;
  };
  totalPages: number;
  currentPageNumber: number;
  currentPage: string;
}

export interface DrawingSettings {
  brushWidth: number;
  currentMode: string;
  currentColor: string;
  fill: boolean;
}

export interface CanvasSettings {
  zoom: number;
  viewportTransform: number[];
}

export interface TabState {
  fileInfo: FileInfo;
  drawingSettings: DrawingSettings;
  canvasSettings: CanvasSettings;
}
