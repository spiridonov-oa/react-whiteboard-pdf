import { fabric } from 'fabric';

export class Board {
  canvas = null;

  constructor(options) {
    this.canvas = this.initCanvas(options);
  }

  initCanvas = (options) => {
    fabric.Canvas.prototype.getItemByAttr = function (attr, name) {
      var object = null,
        objects = this.getObjects();
      for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i][attr] && objects[i][attr] === name) {
          object = objects[i];
          break;
        }
      }
      return object;
    };

    const canvas = new fabric.Canvas('canvas', { width: options.width, height: options.height });

    // Todo: Ready to remove
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.cornerSize = 6;
    fabric.Object.prototype.padding = 10;
    fabric.Object.prototype.borderDashArray = [5, 5];

    return canvas;
  };
}
