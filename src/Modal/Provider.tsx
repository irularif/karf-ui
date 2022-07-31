import { useReducer } from 'react';
import { ModalContext, ModalDispatchContext } from './context';
import { modalReducer } from './reducer';

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalState, dispatch] = useReducer(modalReducer, []);

  return (
    <ModalDispatchContext.Provider value={dispatch}>
      <ModalContext.Provider value={modalState}>{children}</ModalContext.Provider>
    </ModalDispatchContext.Provider>
  );
};
