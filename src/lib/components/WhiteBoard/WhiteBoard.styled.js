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
    height: 3px;
    cursor: pointer;
    animate: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    /// -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%);
    // background: ${color};
    border-radius: 1px;
    border: 0px solid #000000;
    box-shadow: 0 1px 4px rgb(0 0 0 / 0.7);
    // height: ${({ max }) => max / 2 || 10}px;
  }
  &::-webkit-slider-thumb {
    // position: absolute;
    // bottom: 0;
    // left: ${({ value }) => (value * 100) / 150 || 20}px;
    box-shadow: 1px 1px 3px #232323;
    border: 1px solid transparent;
    border-radius: 45px;
    height: ${({ value }) => value + 2 || 20}px;
    width: ${({ value }) => value + 2 || 20}px;
    background: ${({ thumbColor }) => thumbColor || '#232323'};
    cursor: pointer;
    margin-top: ${({ value }) => -value / 2 || -8}px;
    -webkit-appearance: none;
  }
  &:focus::-webkit-slider-runnable-track {
    // background: ${color};
  }
  &::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #232323;
    border-radius: 1px;
    border: 0px solid #000000;
  }
  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #232323;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: ${({ thumbColor }) => thumbColor || '#232323'};
    cursor: pointer;
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
    background: #232323;
    border: 0px solid #000000;
    border-radius: 2px;
    box-shadow: 0px 0px 0px #000000;
  }
  &::-ms-fill-upper {
    background: #232323;
    border: 0px solid #000000;
    border-radius: 2px;
    box-shadow: 0px 0px 0px #000000;
  }
  &::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #232323;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: ${({ thumbColor }) => thumbColor || '#232323'};
    cursor: pointer;
  }
  &:focus::-ms-fill-lower {
    background: #232323;
  }
  &:focus::-ms-fill-upper {
    background: #232323;
  }
`;
