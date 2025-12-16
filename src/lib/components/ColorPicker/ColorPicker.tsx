import React, { useRef, ChangeEvent } from 'react';
import { ColorPickerS, ColorLabelS, HiddenColorInputS } from './ColorPicker.styled';

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
      <HiddenColorInputS
        ref={inputRef}
        type="color"
        name="color"
        id="color"
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </ColorPickerS>
  );
}

export default ColorPicker;
