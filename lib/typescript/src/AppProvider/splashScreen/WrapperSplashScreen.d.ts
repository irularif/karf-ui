import React from 'react';
export interface SplashScreenProps {
    hideSplashScreen: () => void;
}
export interface WrapperSplashScreenProps {
    Component?: React.FC<SplashScreenProps>;
    children: React.ReactNode;
}
export declare const WrapperSplashScreenProps: ({ Component: SplashScreenComponent, children, }: WrapperSplashScreenProps) => JSX.Element;
