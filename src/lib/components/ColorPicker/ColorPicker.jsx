import React, { useRef } from 'react';
import styles from './ColorPicker.module.scss';

function ColorPicker({ size, color, onChange = (e) => {} }) {
  const inputRef = useRef(null);

  const emitClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={styles.colorPicker} onClick={emitClick}>
      <div
        style={{
          borderRadius: size + 'px',
          height: size + 'px',
          width: size + 'px',
          background: color,
        }}
      ></div>
      <input
        ref={inputRef}
        hidden
        className={styles.currentColor}
        type="color"
        name="color"
        id="color"
        onChange={onChange}
      />
    </div>
  );
}

export default ColorPicker;
