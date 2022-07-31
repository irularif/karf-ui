import { createContext } from 'react';
import type { ActionTypes } from './reducer';

export interface TModalProps {
  id: string;
  data?: any;
  callback?: (...args: any) => void;
}

export interface TModalOriginProps extends TModalProps {
  isOpen: boolean;
}

export type TModal = {
  state: Array<TModalOriginProps>;
  addUpdateState: (modal: TModalOriginProps) => void;
  removeState: (id: string) => void;
};

export const ModalContext = createContext<Array<TModalOriginProps> | undefined>(undefined);
export const ModalDispatchContext = createContext<React.Dispatch<ActionTypes> | undefined>(undefined);
