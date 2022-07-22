"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _context = require("../ThemeProvider/context");

const useTheme = () => {
  const context = (0, _react.useContext)(_context.ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const {
    mode
  } = context;
  const selectTheme = (0, _react.useCallback)(data => {
    return data[mode];
  }, [mode]);
  return { ...context,
    selectTheme
  };
};

var _default = useTheme;
exports.default = _default;
//# sourceMappingURL=theme.js.map