import { useCallback, useContext } from 'react';
import { ThemeContext } from '../ThemeProvider/context';

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const {
    mode
  } = context;
  const selectTheme = useCallback(data => {
    return data[mode];
  }, [mode]);
  return { ...context,
    selectTheme
  };
};

export default useTheme;
//# sourceMappingURL=theme.js.map