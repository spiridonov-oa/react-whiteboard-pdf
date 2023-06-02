import EraserIcon from './../images/eraser.svg';
import PencilIcon from './../images/pencil.svg';

export const cursors = {
  eraser: `url(${EraserIcon}) 0 30, auto`,
  pencil: `url(${PencilIcon}) 0 80, auto`,
};

export const getCursor = (type) => {
  console.log(cursors[type]);
  return cursors[type];
};
