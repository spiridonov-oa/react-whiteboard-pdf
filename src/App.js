import React, { useEffect, useState } from 'react';
import { Whiteboard } from './lib/index.js';
import styles from './app.module.scss';

const initJSON = `{"version":"5.3.0","objects":[{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":282,"top":210,"width":320.47,"height":89.27,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Times New Roman","fontWeight":"normal","fontSize":79,"text":"Draw","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":[],"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","minWidth":20,"splitByGrapheme":false}]}`;
const secondJSON = `{"version":"5.3.0","objects":[{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":282,"top":210,"width":320.47,"height":89.27,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Times New Roman","fontWeight":"normal","fontSize":79,"text":"Draw","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":[],"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","minWidth":20,"splitByGrapheme":false},{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":426,"top":337,"width":179.79,"height":89.27,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Times New Roman","fontWeight":"normal","fontSize":79,"text":"here","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":[],"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","minWidth":20,"splitByGrapheme":false}]}`;

const App = () => {
  const [settings, setSettings] = useState();

  useEffect(() => {
    setSettings({ contentJSON: initJSON });
    setTimeout(() => {
      setSettings({ contentJSON: secondJSON, viewportTransform: [1, 0, 0, 1, 0, 0] });
    }, 1000);
  }, []);

  return (
    <div className={styles.app}>
      <main>
        <Whiteboard
          settings={settings}
          onCanvasRender={(data) => {
            console.log('onCanvasRender', data);
            console.log('JSON', JSON.stringify(data.settings.contentJSON));
          }}
        />
      </main>
    </div>
  );
};

export default App;
