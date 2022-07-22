import { get } from 'lodash';
import { useCallback, useContext } from 'react';
import { Device, ScreenContext } from '../ScreenProvider/context';

const useScreen = () => {
  const context = useContext(ScreenContext);

  if (context === undefined) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }

  const {
    size
  } = context;
  const select = useCallback(params => {
    let selected = undefined;
    let pkeys = Object.keys(params);
    let pidx = pkeys.indexOf(size);

    if (pidx > -1) {
      return params[size];
    } else {
      for (let pk of Device) {
        selected = get(params, pk, selected);

        if (pk === size) {
          break;
        }
      }
    }

    return selected;
  }, [size]);
  return { ...context,
    select
  };
};

export default useScreen;
//# sourceMappingURL=screen.js.map