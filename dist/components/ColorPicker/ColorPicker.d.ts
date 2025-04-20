import React from 'react';
interface ColorPickerProps {
    size?: number;
    color?: string;
    onChange?: (color: string) => void;
}
declare function ColorPicker({ size, color, onChange }: ColorPickerProps): React.JSX.Element;
export default ColorPicker;
