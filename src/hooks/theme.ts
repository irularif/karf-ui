import { useCallback, useContext } from 'react';
import { ThemeContext, ThemeDispatchContext, ThemeMode } from '../ThemeProvider/context';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const dispatch = useContext(ThemeDispatchContext);
  if (context === undefined || dispatch === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { mode } = context;

  const selectTheme = useCallback(
    (data: Record<ThemeMode, any>) => {
      return data[mode];
    },
    [mode]
  );

  return { ...context, ...dispatch, selectTheme };
};
