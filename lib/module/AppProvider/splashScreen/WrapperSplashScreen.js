import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react';
import { useApp } from '../context';
export const WrapperSplashScreenProps = _ref => {
  let {
    Component: SplashScreenComponent,
    children
  } = _ref;
  const {
    isLoading,
    isReady,
    setIsReady
  } = useApp();
  const hideSplashScreen = useCallback(() => {
    setIsReady(true);
  }, []);
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();

      if (!SplashScreenComponent) {
        setIsReady(true);
      }
    }
  }, [isLoading, setIsReady, SplashScreenComponent]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, !!isReady && children, !!SplashScreenComponent && !isLoading && !isReady && /*#__PURE__*/React.createElement(SplashScreenComponent, {
    hideSplashScreen: hideSplashScreen
  }));
};
//# sourceMappingURL=WrapperSplashScreen.js.map