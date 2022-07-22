"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThemeProvider = void 0;

var _lodash = require("lodash");

var _react = _interopRequireWildcard(require("react"));

var _helpers = require("../helpers");

var _colors = require("../helpers/colors");

var _context = require("./context");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ThemeProvider = _ref => {
  let {
    children,
    themes
  } = _ref;
  const [theme, setTheme] = (0, _react.useState)({
    mode: (0, _lodash.get)(themes, 'mode', 'light'),
    lightColors: (0, _lodash.merge)(_colors.lightColors, (0, _lodash.get)(themes, 'lightColors', {})),
    darkColors: (0, _lodash.merge)(_colors.darkColors, (0, _lodash.get)(themes, 'darkColors', {})),
    spacing: (0, _lodash.get)(themes, 'spacing', _helpers.defaultSpacing),
    font: (0, _lodash.get)(themes, 'font', {
      family: 'Open Sans',
      size: 14,
      weight: '400'
    }),
    shadow: (0, _lodash.get)(themes, 'shadow', {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    }),
    styles: (0, _lodash.get)(themes, 'styles', {})
  });
  const currentColors = (0, _react.useMemo)(() => {
    if (theme.mode === 'dark') {
      return theme.darkColors;
    }

    return theme.lightColors;
  }, [theme]);
  const updateColors = (0, _react.useCallback)(theme => {
    setTheme(oldTheme => {
      return { ...oldTheme,
        lightColors: (0, _lodash.merge)((0, _lodash.cloneDeep)(oldTheme.lightColors), (0, _lodash.get)(theme, 'lightColors', {})),
        darkColors: (0, _lodash.merge)((0, _lodash.cloneDeep)(oldTheme.darkColors), (0, _lodash.get)(theme, 'darkColors', {}))
      };
    });
  }, []);
  const changeTheme = (0, _react.useCallback)(themeMode => {
    setTheme(oldTheme => {
      return { ...oldTheme,
        mode: themeMode
      };
    });
  }, []);
  const ThemeContextValue = (0, _react.useMemo)(() => {
    return {
      mode: theme.mode,
      spacing: theme.spacing,
      font: Object.keys(theme.font).reduce((prev, k) => ({ ...prev,
        [`font${k.charAt(0).toUpperCase() + k.slice(1)}`]: theme.font[k]
      }), {}),
      shadow: theme.shadow,
      styles: theme.styles,
      colors: currentColors,
      updateColors: updateColors,
      changeTheme: changeTheme
    };
  }, [theme]);
  return /*#__PURE__*/_react.default.createElement(_context.ThemeContext.Provider, {
    value: ThemeContextValue
  }, children);
};

exports.ThemeProvider = ThemeProvider;
//# sourceMappingURL=index.js.map