import styled from 'styled-components';

const color = '#ddd';

export const WhiteBoardS = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
`;

export const ButtonS = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 5px;
  color: #333;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;

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
  margin-top: -8px;
  padding: 12px 8px 4px;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  z-index: 1;
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
  bottom: 0;
  width: 100%;
`;

export const RangeInputS = styled.input`
  & {
    height: 25px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100px;
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
    height: ${({ value }) => value + 2 || 20}px;
    width: ${({ value }) => value + 2 || 20}px;
    background: ${({ thumbColor }) => thumbColor || '#232323'};
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
    background: ${({ thumbColor }) => thumbColor || '#232323'};
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
    background: ${({ thumbColor }) => thumbColor || '#232323'};
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
