import styled from 'styled-components';

export const RangeInputS = styled.input`
  & {
    height: 25px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #232323;
    border-radius: 1px;
    border: 0px solid #000000;
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #232323;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: ${({ thumbColor }) => thumbColor || '#232323'};
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -7px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #232323;
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
