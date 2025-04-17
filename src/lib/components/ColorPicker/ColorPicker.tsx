import React, { useRef, ChangeEvent } from 'react';
import { ColorPickerS, ColorLabelS } from './ColorPicker.styled';

interface ColorPickerProps {
  size?: number;
  color?: string;
  onChange?: (color: string) => void;
}

function ColorPicker({ size = 34, color, onChange = () => {} }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </ColorPickerS>
  );
}

export default ColorPicker;
