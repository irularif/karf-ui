import { ThemeMode } from '../ThemeProvider/context';
declare const useTheme: () => {
    selectTheme: (data: Record<ThemeMode, any>) => any;
    colors: import("..").ThemeColors;
    updateColors: (theme: Omit<import("../ThemeProvider/context").IConfigTheme, "mode">) => void;
    changeTheme: (themeMode: ThemeMode) => void;
    font: Partial<Omit<import("../AppProvider/font/FontLoader").TFont, "source" | "name"> & {
        family: string;
        size: number;
        color: string;
    }>;
    styles?: Partial<import("../ThemeProvider/context").IStyles> | undefined;
    mode: ThemeMode;
    spacing: import("..").ThemeSpacing;
    shadow?: {
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    } | undefined;
};
export default useTheme;
