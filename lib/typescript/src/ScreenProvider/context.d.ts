/// <reference types="react" />
import { ScaledSize, StyleProp } from 'react-native';
export declare type TDevice = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export declare type TOrientation = 'PORTRAIT' | 'LANDSCAPE';
export declare type IConfigSize = Partial<Record<TDevice, any>>;
export interface ResponsiveProps {
    style: StyleProp<any>;
}
export declare type Responsive = Record<TDevice, ResponsiveProps>;
export declare type TScreen = {
    orientation: TOrientation;
    size: TDevice;
    scaleSize: ScaledSize;
};
export declare const Device: string[];
export declare const initialScreen: {
    orientation: TOrientation;
    size: TDevice;
    scaleSize: ScaledSize;
};
export declare const ScreenContext: import("react").Context<TScreen | undefined>;
