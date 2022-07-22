import type { ScaledSize } from 'react-native';
import type { TDevice } from '../ScreenProvider/context';

export type TDeviceSize = Record<TDevice, number>;

export const deviceSizes: TDeviceSize = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const getSize = (screen: ScaledSize) => {
  const { width } = screen;
  let size: TDevice = 'xs';
  if (width < deviceSizes?.sm) {
    size = 'xs';
  } else if (width < deviceSizes.md) {
    size = 'sm';
  } else if (width < deviceSizes.lg) {
    size = 'md';
  } else if (width < deviceSizes.xl) {
    size = 'lg';
  } else if (width >= deviceSizes.xl) {
    size = 'xl';
  }

  return size;
};
