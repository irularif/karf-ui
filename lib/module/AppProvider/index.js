import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getSize } from '../helpers/responsive';
import { ScreenProvider } from '../ScreenProvider';
import { initialScreen } from '../ScreenProvider/context';
import { ThemeProvider } from '../ThemeProvider';
import { AppContext } from './context';
import { FontLoader } from './font/FontLoader';
import { WrapperSplashScreenProps } from './splashScreen/WrapperSplashScreen';
SplashScreen.preventAutoHideAsync();
export const AppProvider = _ref => {
  let {
    fonts,
    themes,
    children,
    SplashScreenComponent
  } = _ref;
  const [app, setApp] = useState({
    initialize: {
      fonts: false
    },
    isReady: false,
    ...initialScreen
  });
  const isLoading = useMemo(() => {
    return Object.values(app.initialize).some(value => !value);
  }, [app]);
  const updateInitialize = useCallback((key, value) => {
    setApp(prev => ({ ...prev,
      initialize: { ...prev.initialize,
        [key]: value
      }
    }));
  }, []);
  const setIsReady = useCallback(value => {
    setApp(prev => ({ ...prev,
      isReady: value
    }));
  }, []);
  const AppContextValue = useMemo(() => ({ ...app,
    isLoading,
    updateInitialize,
    setIsReady
  }), [app, isLoading, updateInitialize]);
  const handleOrientation = useCallback(() => {
    const screen = Dimensions.get('screen');
    const {
      width,
      height
    } = screen;
    let size = getSize(screen);

    if (height >= width) {
      setApp(prev => ({ ...prev,
        orientation: 'PORTRAIT',
        size,
        scaleSize: screen
      }));
    } else {
      setApp(prev => ({ ...prev,
        orientation: 'LANDSCAPE',
        size,
        scaleSize: screen
      }));
    }
  }, []);
  useEffect(() => {
    const event = Dimensions.addEventListener('change', handleOrientation);
    return () => {
      event.remove();
    };
  }, []);
  return /*#__PURE__*/React.createElement(AppContext.Provider, {
    value: AppContextValue
  }, /*#__PURE__*/React.createElement(SafeAreaProvider, null, /*#__PURE__*/React.createElement(ScreenProvider, null, /*#__PURE__*/React.createElement(ThemeProvider, {
    themes: themes
  }, /*#__PURE__*/React.createElement(FontLoader, {
    fonts: fonts
  }), /*#__PURE__*/React.createElement(WrapperSplashScreenProps, {
    Component: SplashScreenComponent
  }, children)))));
};
//# sourceMappingURL=index.js.map