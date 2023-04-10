import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import type { TOrientation } from '../../types/screen';
import { getSize } from '../helpers/screen';
import { ScreenContext } from './context';

const initialScreen = Dimensions.get('screen');

interface ScreenProviderProps {
  children: React.ReactNode;
}

export const ScreenProvider = ({ children }: ScreenProviderProps) => {
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
