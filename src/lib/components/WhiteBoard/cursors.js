import EraserIcon from './../images/eraser.svg';

const getCursor = ({ type }) => {
  switch (type) {
    case 'eraser': {
      return EraserIcon;
    }

    default: {
      return '';
    }
  }
};

export default getCursor;
