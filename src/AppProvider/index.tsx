import { PortalHost, PortalProvider } from '@gorhom/portal';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { TApp } from '../../types/app';
import type { TFonts } from '../../types/font';
import type { IConfigTheme } from '../../types/theme';
import CacheManager from '../helpers/cacheManager';
import { getSize } from '../helpers/screen';
import { KeyboardProvider } from '../KeyboardView/Provider';
import { ModalProvider } from '../Modal/Provider';
import { ScreenProvider } from '../ScreenProvider';
import { initialScreen } from '../ScreenProvider/context';
import { ThemeProvider } from '../ThemeProvider';
import { AppContext, AppDispatchContext } from './context';
import { FontLoader } from './font/FontLoader';
import { SplashScreenProps, WrapperSplashScreenProps } from './splashScreen/WrapperSplashScreen';

export interface AppProviderProps {
  fonts?: TFonts;
  themes?: Partial<IConfigTheme>;
  children?: React.ReactNode;
  SplashScreenComponent?: React.FC<SplashScreenProps>;
}

SplashScreen.preventAutoHideAsync();

export const AppProvider: React.FC<AppProviderProps> = ({
  fonts,
  themes,
  children,
  SplashScreenComponent,
}) => {
  const [app, setApp] = useState<TApp>({
    initialize: {
      fonts: false,
      cache: false,
    },
    isReady: false,
    ...initialScreen,
  });

  const isLoading = useMemo(() => {
    return Object.values(app.initialize).some((value) => !value);
  }, [app]);

  const updateInitialize = useCallback((key: string, value: boolean) => {
    setApp((prev) => ({
      ...prev,
      initialize: {
        ...prev.initialize,
        [key]: value,
      },
    }));
  }, []);

  const setIsReady = useCallback((value: boolean) => {
    setApp((prev) => ({
      ...prev,
      isReady: value,
    }));
  }, []);

  const AppContextValue = useMemo(
    () => ({
      ...app,
      isLoading,
    }),
    [app, isLoading]
  );

  const AppDispatchContextValue = useMemo(
    () => ({
      updateInitialize,
      setIsReady,
    }),
    []
  );

  const handleOrientation = useCallback(() => {
    const screen = Dimensions.get('screen');
    const { width, height } = screen;
    let size = getSize(screen);
    if (height >= width) {
      setApp((prev) => ({
        ...prev,
        orientation: 'PORTRAIT',
        size,
        scaleSize: screen,
      }));
    } else {
      setApp((prev) => ({
        ...prev,
        orientation: 'LANDSCAPE',
        size,
        scaleSize: screen,
      }));
    }
  }, []);

  const ensureDirExists = useCallback(async () => {
    CacheManager.init();
    updateInitialize('cache', true);
  }, []);

  useEffect(() => {
    ensureDirExists();
    const event = Dimensions.addEventListener('change', handleOrientation);

    return () => {
      event.remove();
      CacheManager.cancelProcess();
    };
  }, []);

  return (
    <AppDispatchContext.Provider value={AppDispatchContextValue}>
      <AppContext.Provider value={AppContextValue}>
        <SafeAreaProvider>
          <ScreenProvider>
            <ThemeProvider themes={themes}>
              <KeyboardProvider>
                <FontLoader fonts={fonts} />
                <WrapperSplashScreenProps Component={SplashScreenComponent}>
                  <PortalProvider>
                    <ModalProvider>
                      {children}
                      <PortalHost name="@karf-ui" />
                    </ModalProvider>
                  </PortalProvider>
                </WrapperSplashScreenProps>
              </KeyboardProvider>
            </ThemeProvider>
          </ScreenProvider>
        </SafeAreaProvider>
      </AppContext.Provider>
    </AppDispatchContext.Provider>
  );
};
