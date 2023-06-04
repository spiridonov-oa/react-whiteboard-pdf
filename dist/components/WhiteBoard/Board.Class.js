"use strict";

exports.__esModule = true;
exports.Board = void 0;

var _fabric = require("fabric");

var Board = function Board(_options) {
  this.canvas = null;

  this.initCanvas = function (options) {
    _fabric.fabric.Canvas.prototype.getItemByAttr = function (attr, name) {
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

    var canvas = new _fabric.fabric.Canvas('canvas', {
      width: options.width,
      height: options.height
    }); // Todo: Ready to remove

    _fabric.fabric.Object.prototype.transparentCorners = false;
    _fabric.fabric.Object.prototype.cornerStyle = 'circle';
    _fabric.fabric.Object.prototype.cornerSize = 6;
    _fabric.fabric.Object.prototype.padding = 10;
    _fabric.fabric.Object.prototype.borderDashArray = [5, 5];
    return canvas;
  };

  this.canvas = this.initCanvas(_options);
};

exports.Board = Board;