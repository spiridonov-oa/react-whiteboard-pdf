import React from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import {
  PDFReaderS,
  FileContainer,
  PageInfoS,
  NavigationButton,
  PageInfoDetails,
} from './PdfReader.styled';
import BackIcon from './../images/back.svg';
import NextIcon from './../images/next.svg';
// Add these two imports for react-pdf text layer support
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Fix worker loading by using HTTPS and ensuring version compatibility
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDFReader = ({ fileReaderInfo, updateFileReaderInfo, onPageChange }) => {
  function onRenderSuccess() {
    const importPDFCanvas = document.querySelector('.import-pdf-page canvas');
    const pdfAsImageSrc = importPDFCanvas.toDataURL();

    updateFileReaderInfo({ currentPage: pdfAsImageSrc });
  }

  function onDocumentLoadSuccess({ numPages }) {
    console.log('onDocumentLoadSuccess', numPages);
    updateFileReaderInfo({ totalPages: numPages });
  }

  function changePage(offset) {
    onPageChange(fileReaderInfo.currentPageNumber + offset);
  }

  const nextPage = () => changePage(1);
  const previousPage = () => changePage(-1);
  return (
    <PDFReaderS>
      <FileContainer>
        <Document
          file={fileReaderInfo.file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={({ loaded, total }) =>
            console.log('Loading a document: ' + (loaded / total) * 100 + '%')
          }
        >
          <Page
            className="import-pdf-page"
            onRenderSuccess={onRenderSuccess}
            pageNumber={fileReaderInfo.currentPageNumber}
          />
        </Document>
      </FileContainer>
      {fileReaderInfo.totalPages > 1 && (
        <PageInfoS>
          <NavigationButton
            type="button"
            disabled={fileReaderInfo.currentPageNumber <= 1}
            onClick={previousPage}
          >
            <img src={BackIcon} alt="Back" />
          </NavigationButton>
          <PageInfoDetails>
            Page&nbsp;<b>{fileReaderInfo.currentPageNumber}</b>&nbsp;of{' '}
            {fileReaderInfo.totalPages || '--'}
          </PageInfoDetails>
          <NavigationButton
            type="button"
            disabled={fileReaderInfo.currentPageNumber >= fileReaderInfo.totalPages}
            onClick={nextPage}
          >
            <img src={NextIcon} alt="Next" />
          </NavigationButton>
        </PageInfoS>
      )}
    </PDFReaderS>
  );
};

export default PDFReader;
