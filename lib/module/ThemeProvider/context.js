import { createContext } from 'react';
import { lightColors } from '../helpers/colors';
import { defaultSpacing } from '../helpers/spacing';
export const defaultTheme = {
  mode: 'light',
  colors: lightColors,
  spacing: defaultSpacing,
  font: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'normal'
  },
  style: {}
};
export const ThemeContext = /*#__PURE__*/createContext(undefined);
//# sourceMappingURL=context.js.map