import { createContext } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { getSize } from '../helpers/responsive';
import type { ITheme } from '../ThemeProvider/context';

export type TDevice = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TOrientation = 'PORTRAIT' | 'LANDSCAPE';
export type IConfigSize<T = any> = Partial<Record<TDevice, T>>;

export type Responsive<T> = Record<
  TDevice,
  Partial<
    Omit<T, TDevice> & {
      theme?: ITheme;
    }
  >
>;

export type TScreen = {
  orientation: TOrientation;
  size: TDevice;
  scaleSize: ScaledSize;
};

const screen = Dimensions.get('screen');
const { width: screenWidth, height: screenHeight } = screen;

export const Device = ['xs', 'sm', 'md', 'lg', 'xl'];

export const initialScreen: {
  orientation: TOrientation;
  size: TDevice;
  scaleSize: ScaledSize;
} = {
  orientation: screenHeight >= screenWidth ? 'LANDSCAPE' : 'PORTRAIT',
  size: getSize(screen),
  scaleSize: screen,
};

export const ScreenContext = createContext<TScreen | undefined>(undefined);
