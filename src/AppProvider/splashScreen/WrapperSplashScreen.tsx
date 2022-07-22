import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react';
import { useApp } from '../context';

export interface SplashScreenProps {
  hideSplashScreen: () => void;
}

export interface WrapperSplashScreenProps {
  Component?: React.FC<SplashScreenProps>;
  children: React.ReactNode;
}

export const WrapperSplashScreenProps = ({
  Component: SplashScreenComponent,
  children,
}: WrapperSplashScreenProps) => {
  const { isLoading, isReady, setIsReady } = useApp();

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
  
  return (
    <>
      {!!isReady && children}
      {!!SplashScreenComponent && !isLoading && !isReady && (
        <SplashScreenComponent hideSplashScreen={hideSplashScreen} />
      )}
    </>
  );
};
