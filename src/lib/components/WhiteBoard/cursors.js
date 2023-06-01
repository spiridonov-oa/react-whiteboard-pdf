import EraserIcon from './../images/eraser.svg';
import PencilIcon from './../images/pencil.svg';

const getCursor = ({ type }) => {
  switch (type) {
    case 'eraser': {
      return EraserIcon;
    }
    case 'pencil': {
      return PencilIcon;
    }


    default: {
      return '';
    }
  }
};

export default getCursor;
