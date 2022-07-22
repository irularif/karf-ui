import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { ScreenContext } from './context';
export const screenConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};
const initialScreen = Dimensions.get('screen');
export const ScreenProvider = _ref => {
  let {
    children
  } = _ref;
  const getSize = useCallback(screen => {
    const {
      width
    } = screen;
    let size = 'xs';

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
  const getOrientation = useCallback(screen => {
    const {
      width,
      height
    } = screen;
    let orientation = 'PORTRAIT';

    if (width > height) {
      orientation = 'LANDSCAPE';
    }

    return orientation;
  }, []);
  const [screen, setScreen] = useState({
    orientation: getOrientation(initialScreen),
    size: getSize(initialScreen),
    scaleSize: initialScreen
  });
  const updateScreen = useCallback(() => {
    const screen = Dimensions.get('screen');
    let size = getSize(screen);
    let orientation = getOrientation(screen);
    setScreen(prev => ({ ...prev,
      orientation,
      size
    }));
  }, []);
  useEffect(() => {
    const listener = Dimensions.addEventListener('change', updateScreen);
    return () => {
      listener.remove();
    };
  }, []);
  return /*#__PURE__*/React.createElement(ScreenContext.Provider, {
    value: screen
  }, children);
};
//# sourceMappingURL=index.js.map