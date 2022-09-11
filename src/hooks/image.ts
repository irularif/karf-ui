import { useContext } from 'react';
import { QueueImageContext, QueueImageDispatchContext } from '../Image/context';

const useImage = () => {
  const context = useContext(QueueImageContext);
  const dispatch = useContext(QueueImageDispatchContext);
  if (context === undefined || dispatch === undefined) {
    throw new Error('useImage must be used within a ImageProvider');
  }

  return {
    ...dispatch,
  };
};

export default useImage;
