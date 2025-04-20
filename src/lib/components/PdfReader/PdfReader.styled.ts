import styled from 'styled-components';

export const PDFReaderS = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 14px;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
`;

export const FileContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: flex-start;

  .import-pdf-page {
    canvas {
      max-width: 100%;
    }
  }
`;

export const PageInfoS = styled.div`
  position: absolute;
  z-index: 2;
  left: 5px;
  bottom: 5px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: none;
  overflow: hidden;
`;

export const PageInfoDetails = styled.span`
  color: #333;
  display: flex;
  align-items: center;
  padding: 0 1em;
`;

export const NavigationButton = styled.button`
  padding: 12px;
  width: 40px;
  height: 40px;
  border: none;
  color: #333;
  background-color: transparent;
  outline: none;
  cursor: pointer;

  img {
    width: 16px;
    vertical-align: middle;
  }

  &:hover {
    background-color: #eee;
  }
`;
