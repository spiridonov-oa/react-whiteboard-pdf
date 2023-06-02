import React, { useRef } from 'react';
import { ColorPickerS, ColorLabelS } from './ColorPicker.styled.js';

function ColorPicker({ size = 34, color, onChange = (e) => {} }) {
  const inputRef = useRef(null);

  const emitClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <ColorPickerS size={size} onClick={emitClick}>
      <ColorLabelS size={size} color={color}></ColorLabelS>
      <input
        ref={inputRef}
        style={{ opacity: 0, position: 'absolute', bottom: '-1px', width: '1px', height: '1px' }}
        type="color"
        name="color"
        id="color"
        onChange={onChange}
      />
    </ColorPickerS>
  );
}

export default ColorPicker;
