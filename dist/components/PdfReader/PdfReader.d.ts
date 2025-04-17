import React from 'react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
declare const PDFReader: ({ fileReaderInfo, updateFileReaderInfo, onPageChange, }: {
    fileReaderInfo: any;
    updateFileReaderInfo: any;
    onPageChange?: (pageNumber: number) => void;
}) => React.JSX.Element;
export default PDFReader;
