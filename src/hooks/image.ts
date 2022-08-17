import { useContext } from 'react';
import { ImageContext, ImageDispatchContext } from '../Image/context';

const useImage = () => {
  const context = useContext(ImageContext);
  const dispatch = useContext(ImageDispatchContext);
  if (context === undefined || dispatch === undefined) {
    throw new Error('useImage must be used within a ImageProvider');
  }

  return dispatch;
};

export default useImage;
