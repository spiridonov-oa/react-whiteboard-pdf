import styled from 'styled-components';
import theme from '../../theme';

const color = theme.color;

export const WrapperS = styled.div`
  font-family: inherit;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;
`;

export const TabsS = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const TabS = styled.div`
  position: relative;
  line-height: 1em;
  padding: 1em 1em;
  padding-right: 2em;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  max-width: 200px;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0px -2px 2px -4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;

export const WhiteBoardS = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
`;

export const ButtonS = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  padding: 0;
  min-width: 40px;
  min-height: 40px;
  border-radius: 5px;
  color: #333;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;

  img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }

  &:hover {
    background-color: ${color};
  }

  &.selected {
    background-color: ${color};
  }
`;

export const ToolbarItemS = styled.div`
  margin: 0 2px;
`;

export const SeparatorS = styled.div`
  margin: 0 4px;
  width: 1px;
  height: 30px;
  background: #cbcbcb;
`;

export const ToolbarS = styled.div`
  padding: 4px 4px;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  z-index: 2;
`;

export const ColorBarS = styled.div`
  position: absolute;
  top: 100px;
  left: 50px;
  transform: rotate(90deg);
  transform-origin: 0% 0%;
  padding: 0 0 0 4px;
  border-radius: 5px;
  display: flex;
  font-size: 12px;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  z-index: 2;

  > button {
    transform: rotate(-90deg);
  }
`;

export const ZoomBarS = styled.div`
  position: absolute;
  top: 100px;
  right: 0;
  padding: 4px 0;
  border-radius: 5px;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  z-index: 2;
`;

export const ToolbarHolderS = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PDFWrapperS = styled.div`
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 100%;
`;

export const ColorButtonS = styled.button`
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 5px;
  border: none;
  background-color: ${({ color }) => color};
  outline: none;
  cursor: pointer;
`;

interface RangeInputProps {
  value?: number;
  thumbcolor?: string;
  thumbColor?: string;
}

export const RangeInputS = styled.input<RangeInputProps>`
  & {
    margin: 10px 0;
    transform: rotate(180deg);
    width: 100px;
    height: 25px; /* Adjust height to control the width of the slider */
    -webkit-appearance: none;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    position: relative;
    width: 100%;
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
    // box-shadow: 0 1px 4px rgb(0 0 0 / 0.5);
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);
    border: 1px solid #fff;
    border-radius: 45px;
    height: ${({ value }) => (Number(value) || 18) + 2}px;
    width: ${({ value }) => (Number(value) || 18) + 2}px;
    background: ${({ thumbcolor }) => thumbcolor || '#232323'};
    cursor: pointer;
    margin-top: ${({ value }) => -value / 2 || -8}px;
    -webkit-appearance: none;
  }
  &:focus::-webkit-slider-runnable-track {
    background: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
  }
  &::-moz-range-thumb {
    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);
    border: 1px solid #fff;
    border-radius: 45px;
    height: ${({ value }) => value + 2 || 20}px;
    width: ${({ value }) => value + 2 || 20}px;
    background: ${({ thumbcolor }) => thumbcolor || '#232323'};
    cursor: pointer;
    margin-top: ${({ value }) => -value / 2 || -8}px;
  }

  &::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  &::-ms-fill-lower {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
  }
  &::-ms-fill-upper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #555;
  }
  &::-ms-thumb {
    box-shadow: 0px 1px 4px rgb(0 0 0 / 0.5);
    border: 1px solid #fff;
    border-radius: 45px;
    height: ${({ value }) => value + 2 || 20}px;
    width: ${({ value }) => value + 2 || 20}px;
    background: ${({ thumbcolor }) => thumbcolor || '#232323'};
    cursor: pointer;
    margin-top: ${({ value }) => -value / 2 || -8}px;
  }
  &:focus::-ms-fill-lower {
    background: transparent;
  }
  &:focus::-ms-fill-upper {
    background: transparent;
  }
`;
