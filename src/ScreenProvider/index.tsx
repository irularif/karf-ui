import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { ScreenContext, TOrientation, TDevice } from './context';

export const screenConfig: Record<TDevice, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const initialScreen = Dimensions.get('screen');

interface ScreenProviderProps {
  children: React.ReactNode;
}

export const ScreenProvider = ({ children }: ScreenProviderProps) => {
  const getSize = useCallback((screen: ScaledSize): TDevice => {
    const { width } = screen;
    let size: TDevice = 'xs';
    if (width < screenConfig.sm) {
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
  }, []);

  const getOrientation = useCallback((screen: ScaledSize): TOrientation => {
    const { width, height } = screen;
    let orientation: TOrientation = 'PORTRAIT';
    if (width > height) {
      orientation = 'LANDSCAPE';
    }
    return orientation;
  }, []);

  const [screen, setScreen] = useState({
    orientation: getOrientation(initialScreen),
    size: getSize(initialScreen),
    scaleSize: initialScreen,
  });

  const updateScreen = useCallback(() => {
    const screen = Dimensions.get('screen');
    let size = getSize(screen);
    let orientation = getOrientation(screen);
    setScreen((prev) => ({
      ...prev,
      orientation,
      size,
    }));
  }, []);

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', updateScreen);

    return () => {
      listener.remove();
    };
  }, []);

  return <ScreenContext.Provider value={screen}>{children}</ScreenContext.Provider>;
};
