import React, { useEffect, useState } from 'react';
import { Whiteboard } from './lib/index';
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

  const handleWhiteboardEvent = (name, data) => {
    console.log(name, data);
  };

  return (
    <>
      <GlobalStyle />
      <AppS>
        <MainS>
          <Whiteboard
            state={{
              tabIndex: 0,
              content: {
                json: canvasSettings.contentJSON,
                pageNumber: 0,
              },
            }}
            activeTabIndex={0}
            contentJSON={JSON.stringify(canvasSettings.contentJSON)}
            drawingSettings={{
              brushWidth: 5,
              currentMode: 'PENCIL',
              currentColor: '#000000',
              fill: false,
            }}
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
              COLOR_PICKER: true,
              DEFAULT_COLORS: true,
              FILES: true,
              SAVE_AS_IMAGE: true,
              GO_TO_START: true,
              SAVE_AND_LOAD: true,
              ZOOM: true,
              TABS: true,
            }}
            onFileAdded={(fileData) => handleWhiteboardEvent('onFileAdded', fileData)}
            onObjectAdded={(data, event, canvas) => handleWhiteboardEvent('onObjectAdded', data)}
            onObjectRemoved={(data, event, canvas) =>
              handleWhiteboardEvent('onObjectRemoved', data)
            }
            onObjectModified={(data, event, canvas) =>
              handleWhiteboardEvent('onObjectModified', data)
            }
            onCanvasRender={(state) => handleWhiteboardEvent('onCanvasRender', state)}
            onCanvasChange={(state) => handleWhiteboardEvent('onCanvasChange', state)}
            onZoom={(data, event, canvas) => handleWhiteboardEvent('onZoom', data)}
            onImageUploaded={(file, event, canvas) =>
              handleWhiteboardEvent('onImageUploaded', file)
            }
            onPDFUploaded={(file, event, canvas) => handleWhiteboardEvent('onPDFUploaded', file)}
            onPDFUpdated={(fileInfo, event, canvas) =>
              handleWhiteboardEvent('onPDFUpdated', fileInfo)
            }
            onPageChange={(state) => handleWhiteboardEvent('onPageChange', state)}
            onOptionsChange={(options, state) =>
              handleWhiteboardEvent('onOptionsChange', { options, state })
            }
            onSaveCanvasAsImage={(blob, event, canvas) =>
              handleWhiteboardEvent('onSaveCanvasAsImage', blob)
            }
            onConfigChange={(settings, event, canvas) =>
              handleWhiteboardEvent('onConfigChange', settings)
            }
            onTabStateChange={(state) => handleWhiteboardEvent('onTabStateChange', state)}
            onDocumentChanged={(fileInfo, state) =>
              handleWhiteboardEvent('onDocumentChanged', { fileInfo, state })
            }
          />
        </MainS>
      </AppS>
    </>
  );
};

export default App;
