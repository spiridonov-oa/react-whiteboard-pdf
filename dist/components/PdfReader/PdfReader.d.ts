import React from 'react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
declare const PDFReader: ({ fileReaderInfo, file, updateFileReaderInfo, onPageChange, }: {
    fileReaderInfo: any;
    file: any;
    updateFileReaderInfo: any;
    onPageChange?: (pageNumber: number) => void;
}) => React.JSX.Element;
export default PDFReader;
