import { PortalHost, PortalProvider } from '@gorhom/portal';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getSize } from '../helpers/responsive';
import { ScreenProvider } from '../ScreenProvider';
import { initialScreen } from '../ScreenProvider/context';
import { ThemeProvider } from '../ThemeProvider';
import type { IConfigTheme } from '../ThemeProvider/context';
import { AppContext, TApp } from './context';
import { FontLoader, TFonts } from './font/FontLoader';
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
      updateInitialize,
      setIsReady,
    }),
    [app, isLoading, updateInitialize]
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

  useEffect(() => {
    const event = Dimensions.addEventListener('change', handleOrientation);

    return () => {
      event.remove();
    };
  }, []);

  return (
    <AppContext.Provider value={AppContextValue}>
      <SafeAreaProvider>
        <ScreenProvider>
          <ThemeProvider themes={themes}>
            <FontLoader fonts={fonts} />
            <WrapperSplashScreenProps Component={SplashScreenComponent}>
              <PortalProvider>
                {children}
                <PortalHost name="@karf-ui" />
              </PortalProvider>
            </WrapperSplashScreenProps>
          </ThemeProvider>
        </ScreenProvider>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
};