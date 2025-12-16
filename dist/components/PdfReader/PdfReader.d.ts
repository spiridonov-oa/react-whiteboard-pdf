import React from 'react';
declare const PDFReader: ({
  fileReaderInfo,
  file,
  viewportTransform,
  updateFileReaderInfo,
  onPageChange,
}: {
  fileReaderInfo: any;
  file: any;
  viewportTransform: any;
  updateFileReaderInfo: any;
  onPageChange?: (pageNumber: number) => void;
}) => React.JSX.Element;
export default PDFReader;
