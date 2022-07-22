interface PlatformColors {
    primary: string;
    secondary: string;
    grey: string;
    searchBg: string;
    success: string;
    error: string;
    warning: string;
}
export interface ThemeColors {
    readonly primary: string;
    readonly secondary: string;
    readonly background: string;
    readonly white: string;
    readonly black: string;
    readonly grey100: string;
    readonly grey200: string;
    readonly grey300: string;
    readonly grey400: string;
    readonly grey500: string;
    readonly grey600: string;
    readonly grey700: string;
    readonly grey800: string;
    readonly grey900: string;
    readonly greyOutline: string;
    readonly searchBg: string;
    readonly success: string;
    readonly warning: string;
    readonly error: string;
    readonly disabled: string;
    readonly divider: string;
    readonly platform: {
        ios: PlatformColors;
        android: PlatformColors;
        web: PlatformColors;
        default: PlatformColors;
    };
}
export declare const lightPlatformColors: PlatformColors;
export declare const darkPlatformColors: PlatformColors;
export declare const lightColors: ThemeColors;
export declare const darkColors: ThemeColors;
export {};
