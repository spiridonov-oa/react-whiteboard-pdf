import React from 'react';
import './TextLayer.css';
import './AnnotationLayer.css';
declare const PDFReader: ({ fileReaderInfo, file, viewportTransform, updateFileReaderInfo, onPageChange, }: {
    fileReaderInfo: any;
    file: any;
    viewportTransform: any;
    updateFileReaderInfo: any;
    onPageChange?: (pageNumber: number) => void;
}) => React.JSX.Element;
export default PDFReader;
