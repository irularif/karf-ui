import { useCallback, useContext } from 'react';
import { ThemeContext, ThemeMode } from '../ThemeProvider/context';

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { mode } = context;

  const selectTheme = useCallback(
    (data: Record<ThemeMode, any>) => {
      return data[mode];
    },
    [mode]
  );

  return { ...context, selectTheme };
};

export default useTheme;
