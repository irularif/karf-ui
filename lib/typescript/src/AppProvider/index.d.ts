import React from 'react';
import type { IConfigTheme } from '../ThemeProvider/context';
import { TFonts } from './font/FontLoader';
import { SplashScreenProps } from './splashScreen/WrapperSplashScreen';
export interface AppProviderProps {
    fonts?: TFonts;
    themes?: Partial<IConfigTheme>;
    children?: React.ReactNode;
    SplashScreenComponent?: React.FC<SplashScreenProps>;
}
export declare const AppProvider: React.FC<AppProviderProps>;
