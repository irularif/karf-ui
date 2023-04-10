import type { ScaledSize } from 'react-native';
import type { TDevice } from '../../types/screen';

export const screenConfig: Record<TDevice, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const getSize = (screen: ScaledSize) => {
  const { width } = screen;
  let size: TDevice = 'xs';
  if (width < screenConfig?.sm) {
    size = 'xs';
  } else if (width < screenConfig.md) {
    size = 'sm';
  } else if (width < screenConfig.lg) {
    size = 'md';
  } else if (width < screenConfig.xl) {
    size = 'lg';
  } else if (width >= screenConfig.xl) {
    size = 'xl';
  }

  return size;
};
