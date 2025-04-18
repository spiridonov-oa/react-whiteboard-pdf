import React, { useEffect, useState } from 'react';
import Whiteboard from './lib/index';
import { AppS, MainS, GlobalStyle } from './App.styled';

const initJSON = `{"objects":[{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":282,"top":210,"width":320.47,"height":89.27,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Times New Roman","fontWeight":"normal","fontSize":79,"text":"Draw","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":[],"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","minWidth":20,"splitByGrapheme":false}]}`;
const secondJSON = `{"objects":[{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":282,"top":210,"width":320.47,"height":89.27,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Times New Roman","fontWeight":"normal","fontSize":79,"text":"Draw","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":[],"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","minWidth":20,"splitByGrapheme":false},{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":426,"top":337,"width":179.79,"height":89.27,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Times New Roman","fontWeight":"normal","fontSize":79,"text":"here","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":[],"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","minWidth":20,"splitByGrapheme":false}]}`;

const App = () => {
  const [canvasSettings, setCanvasSettings] = useState({
    contentJSON: '',
    viewportTransform: [1, 0, 0, 1, 0, 0],
  });

  useEffect(() => {
    setCanvasSettings({ contentJSON: JSON.parse(initJSON), viewportTransform: [1, 0, 0, 1, 0, 0] });
    setTimeout(() => {
      setCanvasSettings({
        contentJSON: JSON.parse(secondJSON),
        viewportTransform: [1, 0, 0, 1, 0, 0],
      });
    }, 1000);
  }, []);

  const defaultFunction = (name, data) => {
    console.log(name, data);
  };

  return (
    <>
      <GlobalStyle />
      <AppS>
        <MainS>
          <Whiteboard
            state={{
              json: canvasSettings.contentJSON,
              viewportTransform: canvasSettings.viewportTransform,
            }}
            onObjectAdded={(data) => defaultFunction('onObjectAdded', data)}
            onObjectRemoved={(data) => defaultFunction('onObjectRemoved', data)}
            onObjectModified={(data) => defaultFunction('onObjectModified', data)}
            onCanvasRender={(data) => defaultFunction('onCanvasRender', data)}
            onCanvasChange={(data) => defaultFunction('onCanvasChange', data)}
            onZoom={(data) => defaultFunction('onZoom', data)}
            onImageUploaded={(data) => defaultFunction('onImageUploaded', data)}
            onPDFUploaded={(data) => defaultFunction('onPDFUploaded', data)}
            onPDFUpdated={(data) => defaultFunction('onPDFUpdated', data)}
            onPageChange={(data) => defaultFunction('onPageChange', data)}
            onOptionsChange={(data) => defaultFunction('onOptionsChange', data)}
            onSaveCanvasAsImage={(data) => defaultFunction('onSaveCanvasAsImage', data)}
            onConfigChange={(data) => defaultFunction('onConfigChange', data)}
            onSaveCanvasState={(data) => defaultFunction('onSaveCanvasState', data)}
            onDocumentChanged={(data) => defaultFunction('onDocumentChanged', data)}
          />
        </MainS>
      </AppS>
    </>
  );
};

export default App;
