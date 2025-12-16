"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _ColorPicker = require("./ColorPicker.styled");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ColorPicker(_ref) {
  let {
    size = 34,
    color,
    onChange = () => {}
  } = _ref;
  const inputRef = (0, _react.useRef)(null);
  const emitClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return /*#__PURE__*/_react.default.createElement(_ColorPicker.ColorPickerS, {
    size: size,
    onClick: emitClick
  }, /*#__PURE__*/_react.default.createElement(_ColorPicker.ColorLabelS, {
    size: size,
    color: color
  }), /*#__PURE__*/_react.default.createElement(_ColorPicker.HiddenColorInputS, {
    ref: inputRef,
    type: "color",
    name: "color",
    id: "color",
    onChange: e => onChange(e.target.value)
  }));
}
var _default = exports.default = ColorPicker;