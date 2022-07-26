import { createContext } from 'react';

export interface TKeyboard {
  isVisible: boolean;
  height: number;
}

export const KeyboardContext = createContext<TKeyboard | undefined>(undefined);
