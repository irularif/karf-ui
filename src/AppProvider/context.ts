import React from 'react';
import type { ScaledSize } from 'react-native';
import type { TDevice, TOrientation } from '../ScreenProvider/context';

type TInitialState = 'fonts';

export type TApp = {
  initialize: Record<TInitialState, boolean>;
  isReady: boolean;
  size: TDevice;
  orientation: TOrientation;
  scaleSize: ScaledSize;
};

export type TAppContext = TApp & {
  isLoading: boolean;
};

export type TAppDispatchContext = {
  updateInitialize: (key: TInitialState, state: boolean) => void;
  setIsReady: (value: boolean) => void;
};

export const AppContext = React.createContext<TAppContext | undefined>(undefined);
export const AppDispatchContext = React.createContext<TAppDispatchContext | undefined>(undefined);
