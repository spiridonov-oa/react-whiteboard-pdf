import { Textbox } from 'fabric';
export declare const modes: {
    PENCIL: string;
    LINE: string;
    RECTANGLE: string;
    TRIANGLE: string;
    ELLIPSE: string;
    ERASER: string;
    SELECT: string;
    TEXT: string;
};
export declare class Board {
    canvas: any;
    canvasNode: HTMLElement | null;
    modes: any;
    cursorPencil: string;
    mouseDown: boolean;
    drawInstance: any;
    drawingSettings: any;
    init: boolean;
    element: ResizeObserver | null;
    editedTextObject: Textbox | null;
    canvasConfig: {
        zoom: number;
        contentJSON: any;
        minZoom: number;
        maxZoom: number;
        viewportTransform: number[];
    };
    nowX: number;
    nowY: number;
    canvasRef: any;
    limitScale: number;
    sketchWidthLimit: number;
    sketchHeightLimit: number;
    constructor(params: any);
    initCanvas: (canvasNode: any) => any;
    applyCanvasConfig: (canvasConfig: any) => void;
    applyJSON: (json: any) => void;
    debounce: (func: any, wait?: number) => (...args: any[]) => void;
    addZoomListeners: (params?: {
        scale: number;
    }) => void;
    axisLimit: ({ scale, vpt, axis }: {
        scale: any;
        vpt: any;
        axis: any;
    }) => any;
    setDrawingSettings: (drawingSettings: any) => void;
    setCanvasConfig: (canvasConfig: any) => void;
    setDrawingMode: (mode: any) => void;
    resetCanvas: (canvas: any) => void;
    handleResize: (callback: any, customCallback?: any) => ResizeObserver;
    resizeCanvas: (canvas: any, whiteboard: any) => () => void;
    removeCanvasListener: (canvas: any) => void;
    draw: () => void;
    createLine: () => void;
    startAddLine: () => ({ e }: {
        e: any;
    }) => void;
    startDrawingLine: () => ({ e }: {
        e: any;
    }) => void;
    createRect: () => void;
    startAddRect: () => ({ e }: {
        e: any;
    }) => void;
    startDrawingRect: () => ({ e }: {
        e: any;
    }) => void;
    stopDrawing: () => void;
    createEllipse: () => void;
    startAddEllipse: () => ({ e }: {
        e: any;
    }) => void;
    startDrawingEllipse: () => ({ e }: {
        e: any;
    }) => void;
    createTriangle: () => void;
    startAddTriangle: () => ({ e }: {
        e: any;
    }) => void;
    startDrawingTriangle: () => ({ e }: {
        e: any;
    }) => void;
    createText: () => void;
    addText: (e: any) => void;
    editText: (textObject: any) => void;
    cancelTextEditing: () => void;
    eraserOn: () => void;
    onSelectMode: () => void;
    clearCanvas: () => void;
    changeZoom: ({ point, scale }: {
        point?: {
            x: number;
            y: number;
        };
        scale: number;
    }) => void;
    resetZoom: () => void;
    onZoom: (params: any) => void;
    fireViewportChangeEvent: (params: any) => void;
    openPage: (page: any) => Promise<unknown>;
    getCanvasContentBoundaries: () => {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        width: number;
        height: number;
    };
    /**
     * Public method to process an image file and add it to the canvas
     * @param {File} file - The image file to process
     * @returns {Promise<Object>} - Promise resolving to the created image object
     * @public
     */
    processImageFile: (file: File) => Promise<void>;
    removeBoard: () => void;
}
