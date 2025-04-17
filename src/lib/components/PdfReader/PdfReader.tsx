import React, { useEffect, useState, useCallback } from 'react';
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

const PDFReader = ({
  fileReaderInfo,
  updateFileReaderInfo,
  onPageChange = (pageNumber: number) => {},
}) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(
    fileReaderInfo?.currentPageNumber || 0,
  );
  const [totalPages, setTotalPages] = useState(fileReaderInfo?.totalPages || 0);
  const [file, setFile] = useState(fileReaderInfo?.file || null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (fileReaderInfo) {
      setCurrentPageNumber(fileReaderInfo.currentPageNumber);
      setTotalPages(fileReaderInfo.totalPages);
      setFile(fileReaderInfo.file);
    }
  }, [fileReaderInfo]);

  const onRenderSuccess = useCallback(() => {
    try {
      const importPDFCanvas: HTMLCanvasElement = document.querySelector('.import-pdf-page canvas');
      if (!importPDFCanvas) {
        console.error('PDF canvas element not found');
        return;
      }

      const pdfAsImageSrc = importPDFCanvas.toDataURL();

      updateFileReaderInfo({
        currentPage: pdfAsImageSrc,
        file,
        totalPages,
        currentPageNumber,
      });
    } catch (error) {
      console.error('Error converting PDF to image:', error);
    }
  }, [file, totalPages, currentPageNumber, updateFileReaderInfo]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }) => {
      setTotalPages(numPages);
      setCurrentPageNumber(0);
      setFile(fileReaderInfo.file);
      updateFileReaderInfo({
        totalPages: numPages,
        currentPageNumber: 0,
        file: fileReaderInfo.file,
      });
    },
    [fileReaderInfo, updateFileReaderInfo],
  );

  const changePage = useCallback(
    (offset) => {
      const newPageNumber = currentPageNumber + offset;
      if (newPageNumber < 0 || newPageNumber >= totalPages) {
        return;
      }
      setCurrentPageNumber(newPageNumber);
      onPageChange(newPageNumber);
    },
    [currentPageNumber, totalPages, onPageChange],
  );

  const nextPage = useCallback(() => changePage(1), [changePage]);
  const previousPage = useCallback(() => changePage(-1), [changePage]);

  const handleLoadProgress = useCallback(({ loaded, total }) => {
    const progress = Math.round((loaded / total) * 100);
    setLoadingProgress(progress);
    console.log(`Loading document: ${progress}%`);
  }, []);

  if (!fileReaderInfo || !fileReaderInfo.file) {
    return <div></div>;
  }

  return (
    <PDFReaderS>
      <FileContainer>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={handleLoadProgress}
          error={<div>An error occurred while loading the PDF.</div>}
          loading={<div>Loading PDF... {loadingProgress}%</div>}
        >
          <Page
            className="import-pdf-page"
            onRenderSuccess={onRenderSuccess}
            pageNumber={currentPageNumber + 1}
            scale={1.0}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            error={<div>An error occurred while rendering the page.</div>}
          />
        </Document>
      </FileContainer>
      {totalPages > 1 && (
        <PageInfoS>
          <NavigationButton
            type="button"
            disabled={currentPageNumber <= 0}
            onClick={previousPage}
            aria-label="Previous page"
          >
            <img src={BackIcon} alt="Back" />
          </NavigationButton>
          <PageInfoDetails>
            Page&nbsp;<b>{currentPageNumber + 1}</b>&nbsp;of {totalPages || '--'}
          </PageInfoDetails>
          <NavigationButton
            type="button"
            disabled={currentPageNumber + 1 >= totalPages}
            onClick={nextPage}
            aria-label="Next page"
          >
            <img src={NextIcon} alt="Next" />
          </NavigationButton>
        </PageInfoS>
      )}
    </PDFReaderS>
  );
};

export default PDFReader;
