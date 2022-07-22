import React from 'react';
import type { ScaledSize } from 'react-native';
import type { TDevice, TOrientation } from '../ScreenProvider/context';
declare type TInitialState = 'fonts';
export declare type TApp = {
    initialize: Record<TInitialState, boolean>;
    isReady: boolean;
    size: TDevice;
    orientation: TOrientation;
    scaleSize: ScaledSize;
};
export declare type TAppContext = TApp & {
    isLoading: boolean;
    updateInitialize: (key: TInitialState, state: boolean) => void;
    setIsReady: (value: boolean) => void;
};
export declare const AppContext: React.Context<TAppContext | undefined>;
export declare const useApp: () => TAppContext;
export {};
