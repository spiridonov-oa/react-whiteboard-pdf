# react-whiteboard-pdf

<div>
  <h2>
    React virtual whiteboard with PDF and Images upload functionality
    <br />
  </h2>
</div>

<br />

Check App demo here:

# App [DEMO](https://statuesque-muffin-fb224e.netlify.app/)

<br/>

## If you like this project you can help us with $1,000,000 donation or any other amount

github: [github.com/sponsors/spiridonov-oa](https://github.com/sponsors/spiridonov-oa)
patreon: [patreon.com/OlegSpiridonov](https://patreon.com/OlegSpiridonov)

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
      // default options
      options={{
        brushWidth: 5, // :number (optional) (default: 5) - brush size for drawing
        background: false, // :boolean (optional) (default: false) - polkadot as background picture
        currentMode: modes.PENCIL, //
        currentColor: '#000000',
        brushWidth: 5,
        fill: false,
      }}
      // default controls
      controls={{
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
      }}
      canvasJSON={null} // JSON to render in canvas
      onObjectAdded={(addedObject) => {}}
      onObjectRemoved={(removedObject) => {}}
    />
  );
};
```
