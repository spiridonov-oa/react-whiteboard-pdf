import styled from 'styled-components';
import theme from '../../theme';

export const PDFReaderS = styled.div`
  width: 100%;
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
`;

export const FileContainer = styled.div`
  display: none;
`;

export const PageInfoS = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 50px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: none;
  margin-bottom: 10px;
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
