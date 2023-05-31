# react-whiteboard-pdf

<div align="center">
  <h2>
    React virtual whiteboard with PDF and Images upload functionality
    <br />
  </h2>
</div>

# App [DEMO](https://statuesque-muffin-fb224e.netlify.app/)

<br/>

## Compatibility

React 17

<br/>

## Installation

```shell
npm install react-whiteboard-pdf
```

or

```shell
yarn add react-whiteboard-pdf
```

<br/>

## Usage

```javascript
import { Whiteboard } from 'react-whiteboard-pdf';

const App = () => {
  return (
    <Whiteboard
      options={{
        brushWidth: 5, // :number (optional) (default: 5) - brush size for drawing
        background: false, // :boolean (optional) (default: false) - polkadot as background picture
        currentMode: modes.PENCIL, //
        currentColor: '#000000',
        brushWidth: 5,
        fill: false,
      }}
      controls={
        PENCIL: true,
        LINE: true,
        RECTANGLE: true,
        ELLIPSE: true,
        TRIANGLE: true,
        TEXT: true,
        SELECT: true,
        ERASER: true,
        CLEAR: true,
        FILL: true,
        BRUSH: true,
        COLOR: true,
        FILES: true,
        TO_JSON: true,
        SAVE_AS_IMAGE: true,
        ZOOM: true,
      }
      canvasJSON={null}
      onObjectAdded = {() => {}}
      onObjectRemoved = {() => {}}
    />
  );
};
```
