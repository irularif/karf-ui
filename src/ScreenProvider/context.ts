import { createContext } from 'react';
import { Dimensions, ScaledSize, StyleProp } from 'react-native';
import { getSize } from '../helpers/responsive';

export type TDevice = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TOrientation = 'PORTRAIT' | 'LANDSCAPE';
export type IConfigSize = Partial<Record<TDevice, any>>;

export interface ResponsiveProps {
  style: StyleProp<any>;
}

export type Responsive = Record<TDevice, ResponsiveProps>;

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
