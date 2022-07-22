import React from 'react';
import { IConfigTheme } from './context';
interface ThemeProviderProps {
    themes?: Partial<IConfigTheme>;
    children: React.ReactNode;
}
export declare const ThemeProvider: ({ children, themes }: ThemeProviderProps) => JSX.Element;
export {};
