import { get, merge } from 'lodash';
import { defaultTheme, ThemeContext } from '../ThemeProvider/context';

const ThemedComponent = (WrappedComponent, displayName) => {
  return Object.assign(props => {
    const {
      children,
      ...rest
    } = props;
    return /*#__PURE__*/React.createElement(ThemeContext.Consumer, null, context => {
      // If user isn't using ThemeProvider
      if (!context) {
        const newProps = { ...rest,
          theme: defaultTheme,
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
      const basicStyle = get(styles, 'displayName', {});
      const basicTheme = {
        colors,
        mode,
        spacing,
        font,
        shadow,
        style: basicStyle
      };
      const theme = merge({}, basicTheme, rest.theme);
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

export default withTheme;
//# sourceMappingURL=withTheme.js.map