"use strict";

exports.__esModule = true;
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _ColorPickerStyled = require("./ColorPicker.styled.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ColorPicker(_ref) {
  let {
    size = 34,
    color,
    onChange = e => {}
  } = _ref;
  const inputRef = (0, _react.useRef)(null);
  const emitClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return /*#__PURE__*/_react.default.createElement(_ColorPickerStyled.ColorPickerS, {
    size: size,
    onClick: emitClick
  }, /*#__PURE__*/_react.default.createElement(_ColorPickerStyled.ColorLabelS, {
    size: size,
    color: color
  }), /*#__PURE__*/_react.default.createElement("input", {
    ref: inputRef,
    style: {
      opacity: 0,
      position: 'absolute',
      bottom: '-1px',
      width: '1px',
      height: '1px'
    },
    type: "color",
    name: "color",
    id: "color",
    onChange: e => onChange(e.target.value, e)
  }));
}
var _default = exports.default = ColorPicker;