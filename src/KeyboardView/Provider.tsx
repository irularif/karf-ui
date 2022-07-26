import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { KeyboardContext } from './context';

interface KeyboardProviderProps {
  children: React.ReactNode;
}

export const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
  const [keyboard, setKeyboard] = useState({
    isVisible: false,
    height: 0,
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboard({
        isVisible: true,
        height: e.endCoordinates.height,
      });
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', (e) => {
      setKeyboard({
        isVisible: false,
        height: e.endCoordinates.height,
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return <KeyboardContext.Provider value={keyboard}>{children}</KeyboardContext.Provider>;
};
