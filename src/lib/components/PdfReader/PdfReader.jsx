import React, { useEffect } from 'react';
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

const PDFReader = ({ fileReaderInfo, updateFileReaderInfo, onPageChange = () => {} }) => {
  const [currentPageNumber, setCurrentPageNumber] = React.useState(
    fileReaderInfo.currentPageNumber,
  );
  const [totalPages, setTotalPages] = React.useState(fileReaderInfo.totalPages);
  const [file, setFile] = React.useState(fileReaderInfo.file);

  useEffect(() => {
    if (fileReaderInfo) {
      setCurrentPageNumber(fileReaderInfo.currentPageNumber);
      setTotalPages(fileReaderInfo.totalPages);
      setFile(fileReaderInfo.file);
    }
  }, [fileReaderInfo]);

  function onRenderSuccess() {
    const importPDFCanvas = document.querySelector('.import-pdf-page canvas');
    const pdfAsImageSrc = importPDFCanvas.toDataURL();

    updateFileReaderInfo({
      currentPage: pdfAsImageSrc,
      file: file,
      totalPages,
      currentPageNumber: currentPageNumber,
    });
  }

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
    setCurrentPageNumber(0);
    setFile(fileReaderInfo.file);
    updateFileReaderInfo({ totalPages: numPages, currentPageNumber: 0, file });
  }

  function changePage(offset) {
    if (currentPageNumber + offset < 0 || currentPageNumber + offset >= totalPages) {
      return;
    }
    setCurrentPageNumber(currentPageNumber + offset);
    onPageChange(currentPageNumber + offset);
  }

  const nextPage = () => changePage(1);
  const previousPage = () => changePage(-1);

  if (!fileReaderInfo || !fileReaderInfo.file) {
    return <div></div>;
  }

  return (
    <PDFReaderS>
      <FileContainer>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={({ loaded, total }) =>
            console.log('Loading a document: ' + (loaded / total) * 100 + '%')
          }
        >
          <Page
            className="import-pdf-page"
            onRenderSuccess={onRenderSuccess}
            pageNumber={currentPageNumber + 1}
            scale={1.0}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            renderInteractiveForms={false}
          />
        </Document>
      </FileContainer>
      {totalPages > 1 && (
        <PageInfoS>
          <NavigationButton type="button" disabled={currentPageNumber <= 0} onClick={previousPage}>
            <img src={BackIcon} alt="Back" />
          </NavigationButton>
          <PageInfoDetails>
            Page&nbsp;<b>{currentPageNumber + 1}</b>&nbsp;of {totalPages || '--'}
          </PageInfoDetails>
          <NavigationButton
            type="button"
            disabled={currentPageNumber + 1 >= totalPages}
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
