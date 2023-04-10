import { createContext } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import type { TDevice, TOrientation, TScreen } from '../../types/screen';
import { getSize } from '../helpers/screen';

const screen = Dimensions.get('screen');
const { width: screenWidth, height: screenHeight } = screen;

export const Device: Array<TDevice> = ['xs', 'sm', 'md', 'lg', 'xl'];

export const initialScreen: {
  orientation: TOrientation;
  size: TDevice;
  scaleSize: ScaledSize;
} = {
  orientation: screenHeight >= screenWidth ? 'LANDSCAPE' : 'PORTRAIT',
  size: getSize(screen),
  scaleSize: screen,
};

export const ScreenContext = createContext<TScreen>(initialScreen);
