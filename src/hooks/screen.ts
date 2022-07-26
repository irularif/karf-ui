import { get } from 'lodash';
import { useCallback, useContext } from 'react';
import { Device, IConfigSize, ScreenContext, TDevice } from '../ScreenProvider/context';

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (context === undefined) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }

  const { size } = context;

  const select = useCallback(
    <T>(params: IConfigSize<T>) => {
      let selected = undefined;
      let pkeys = Object.keys(params) as TDevice[];
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
    },
    [size]
  );

  return {
    ...context,
    select,
  };
};
