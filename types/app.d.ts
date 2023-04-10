import type { ScaledSize } from 'react-native';
import type { TDevice, TOrientation } from './screen';

type TInitialState = 'fonts' | 'cache';

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
