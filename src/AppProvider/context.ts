import React, { useContext } from 'react';
import type { ScaledSize } from 'react-native';
import type { TDevice, TOrientation } from '../ScreenProvider/context';

type TInitialState = 'fonts';

export type TApp = {
  initialize: Record<TInitialState, boolean>;
  isReady: boolean;
  size: TDevice;
  orientation: TOrientation;
  scaleSize: ScaledSize;
}

export type TAppContext = TApp & {
  isLoading: boolean;
  updateInitialize: (key: TInitialState, state: boolean) => void;
  setIsReady: (value: boolean) => void;
};

export const AppContext = React.createContext<TAppContext | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider');
  }

  return context;
};
