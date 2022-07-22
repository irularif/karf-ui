/// <reference types="react" />
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { TFont } from '../AppProvider/font/FontLoader';
import { ThemeColors } from '../helpers/colors';
import { ThemeSpacing } from '../helpers/spacing';
export interface IStyles {
    Text: StyleProp<TextStyle>;
    View: StyleProp<ViewStyle>;
    Icon: StyleProp<ViewStyle>;
}
export declare type ThemeMode = 'light' | 'dark';
export interface IConfigTheme {
    mode: ThemeMode;
    lightColors: ThemeColors;
    darkColors: ThemeColors;
    spacing: ThemeSpacing;
    font: Partial<Omit<TFont, 'source' | 'name'> & {
        family: string;
        size: number;
        color: string;
    }>;
    shadow?: {
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    styles?: Partial<IStyles>;
}
export interface ITheme extends Omit<IConfigTheme, 'lightColors' | 'darkColors' | 'font' | 'styles'> {
    style: IStyles[keyof IStyles];
    colors: ThemeColors;
    font: {
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        fontStyle: string;
    };
}
export declare const defaultTheme: ITheme;
export interface IThemeContext extends Omit<IConfigTheme, 'lightColors' | 'darkColors'> {
    colors: ThemeColors;
    updateColors: (theme: Omit<IConfigTheme, 'mode'>) => void;
    changeTheme: (themeMode: ThemeMode) => void;
}
export declare const ThemeContext: import("react").Context<IThemeContext | undefined>;
