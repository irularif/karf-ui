"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseStyle = exports.getStyleValue = void 0;

var _lodash = require("lodash");

var _reactNative = require("react-native");

var _normalizeText = _interopRequireDefault(require("./normalizeText"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fontStyle = style => {
  const fontStyle = (0, _lodash.get)(style, 'fontStyle', 'normal');
  const fontWeight = (0, _lodash.get)(style, 'fontWeight', '400');
  const fontFamily = (0, _lodash.get)(style, 'fontFamily', 'Open Sans').replace(/\s/g, '-') + '_' + fontStyle + '_' + fontWeight;
  const fontSize = (0, _normalizeText.default)((0, _lodash.get)(style, 'fontSize', 14));
  return _reactNative.StyleSheet.flatten([style, {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle
  }]);
};

const parseStyle = function () {
  for (var _len = arguments.length, style = new Array(_len), _key = 0; _key < _len; _key++) {
    style[_key] = arguments[_key];
  }

  let _style = _reactNative.StyleSheet.flatten([...style]);

  const isText = Object.keys(_style).findIndex(x => x.indexOf('font') > -1) > -1;

  if (isText) {
    _style = fontStyle(_style);
  }

  return _style;
};

exports.parseStyle = parseStyle;

const getStyleValue = (style, attr) => {
  let value = undefined;
  attr.forEach(key => {
    value = (0, _lodash.get)(style, key, value);
  });
  return value;
};

exports.getStyleValue = getStyleValue;
//# sourceMappingURL=style.js.map