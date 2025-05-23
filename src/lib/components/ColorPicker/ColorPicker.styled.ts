import styled from 'styled-components';

interface ColorPickerProps {
  size?: number;
}

interface ColorLabelProps {
  size?: number;
  color?: string;
}

export const ColorPickerS = styled.div<ColorPickerProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #999;
  border-radius: ${({ size }) => size || 34}px;
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

export const ColorLabelS = styled.div<ColorLabelProps>`
  border-radius: ${({ size }) => size - 4 || 28}px;
  height: ${({ size }) => size - 4 || 28}px;
  width: ${({ size }) => size - 4 || 28}px;
  background: ${({ color }) => color || '#000'};
`;
