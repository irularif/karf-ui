import { useContext } from 'react';
import { KeyboardContext } from '../KeyboardView/context';

export interface IKeyboard {
  isVisible: boolean;
  height: number;
}

export const useKeyboard = (): IKeyboard => {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }

  return context;
};
