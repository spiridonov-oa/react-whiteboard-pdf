"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ColorPickerModule = _interopRequireDefault(require("./ColorPicker.module.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ColorPicker(_ref) {
  var size = _ref.size,
      color = _ref.color,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function (e) {} : _ref$onChange;
  var inputRef = (0, _react.useRef)(null);

  var emitClick = function emitClick() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: _ColorPickerModule.default.colorPicker,
    onClick: emitClick
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      borderRadius: size + 'px',
      height: size + 'px',
      width: size + 'px',
      background: color
    }
  }), /*#__PURE__*/_react.default.createElement("input", {
    ref: inputRef,
    hidden: true,
    className: _ColorPickerModule.default.currentColor,
    type: "color",
    name: "color",
    id: "color",
    onChange: onChange
  }));
}

var _default = ColorPicker;
exports.default = _default;