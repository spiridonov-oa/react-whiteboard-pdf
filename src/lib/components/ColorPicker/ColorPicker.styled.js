import styled from 'styled-components';

export const ColorPickerS = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #999;
  border-radius: 5px;
  height: ${({ size }) => size || 34}px;
  width: ${({ size }) => size || 34}px;
  cursor: pointer;

  > div {
    //box-shadow: 1px 1px 3px rgb(0 0 0 / 0.6);
  }

  &:hover {
    background-color: #eee;
  }
`;

export const ColorLabelS = styled.div`
  border-radius: 3px;
  height: ${({ size }) => size - 4 || 28}px;
  width: ${({ size }) => size - 4 || 28}px;
  background: ${({ color }) => color || '#000'};
`;
