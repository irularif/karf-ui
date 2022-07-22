"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _context = require("../ThemeProvider/context");

const ThemedComponent = (WrappedComponent, displayName) => {
  return Object.assign(props => {
    const {
      children,
      ...rest
    } = props;
    return /*#__PURE__*/React.createElement(_context.ThemeContext.Consumer, null, context => {
      // If user isn't using ThemeProvider
      if (!context) {
        const newProps = { ...rest,
          theme: _context.defaultTheme,
          children
        };
        return /*#__PURE__*/React.createElement(WrappedComponent, newProps);
      }

      const {
        colors,
        mode,
        spacing,
        font,
        shadow,
        styles
      } = context;
      const basicStyle = (0, _lodash.get)(styles, 'displayName', {});
      const basicTheme = {
        colors,
        mode,
        spacing,
        font,
        shadow,
        style: basicStyle
      };
      const theme = (0, _lodash.merge)({}, basicTheme, rest.theme);
      const newProps = { ...rest,
        theme,
        children
      };
      return /*#__PURE__*/React.createElement(WrappedComponent, newProps);
    });
  }, {
    displayName: displayName
  });
};

function withTheme(WrappedComponent) {
  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  const Component = ThemedComponent(WrappedComponent, name);
  return Component;
}

var _default = withTheme;
exports.default = _default;
//# sourceMappingURL=withTheme.js.map