import type { ITheme } from './theme';

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
