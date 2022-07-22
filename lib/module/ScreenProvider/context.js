import { createContext } from 'react';
import { Dimensions } from 'react-native';
import { getSize } from '../helpers/responsive';
const screen = Dimensions.get('screen');
const {
  width: screenWidth,
  height: screenHeight
} = screen;
export const Device = ['xs', 'sm', 'md', 'lg', 'xl'];
export const initialScreen = {
  orientation: screenHeight >= screenWidth ? 'LANDSCAPE' : 'PORTRAIT',
  size: getSize(screen),
  scaleSize: screen
};
export const ScreenContext = /*#__PURE__*/createContext(undefined);
//# sourceMappingURL=context.js.map