# react-whiteboard-pdf

React whiteboard component based on [Fabric.js](http://fabricjs.com/) and [React-PDF](https://github.com/wojtekmaj/react-pdf#readme).

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
  return <Whiteboard aspectRatio={4 / 3}
  options={{
    brushWidth: 5, // :number (optional) (default: 5) - brush size for drawing
    background: false, // :boolean (optional) (default: false) - polkadot as background picture
    currentMode: modes.PENCIL, //
    currentColor: '#000000',
    brushWidth: 5,
    fill: false,
    group: {},
  }}
  controls={}
  canvasJSON={null}
  onObjectAdded = {() => {}}
  onObjectRemoved = {() => {}}
  />;
};
```

<br/>

## props
