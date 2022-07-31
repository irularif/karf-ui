import { useContext } from 'react';
import { AppContext, AppDispatchContext } from '../AppProvider/context';

export const useApp = () => {
  const dispatch = useContext(AppDispatchContext);
  const context = useContext(AppContext);
  if (context === undefined || dispatch === undefined) {
    throw new Error('useApp must be used within a AppProvider');
  }

  return { ...context, ...dispatch };
};
