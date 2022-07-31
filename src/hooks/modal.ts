import { cloneDeep, get } from 'lodash';
import { useCallback, useContext, useMemo } from 'react';
import {
  ModalContext,
  ModalDispatchContext,
  TModalOriginProps,
  TModalProps,
} from '../Modal/context';
import { ModalActions } from '../Modal/reducer';

export const useModalState = () => {
  const state = useContext(ModalContext);
  const dispatch = useContext(ModalDispatchContext);
  if (state === undefined || dispatch === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  const addUpdateState = useCallback(
    (modal: TModalOriginProps) => {
      dispatch({
        type: ModalActions.ADD_UPDATE_MODAL,
        payload: modal,
      });
    },
    []
  );

  const deleteState = useCallback(
    (id: string) => {
      dispatch({
        type: ModalActions.REMOVE_MODAL,
        payload: {
          id,
        },
      });
    },
    []
  );

  return { state, addUpdateState, deleteState };
};

export const useModal = (id?: string) => {
  const { state, addUpdateState } = useModalState();

  const modal: TModalOriginProps = useMemo(() => {
    const _modal = state.find((item) => item.id === id);
    if (!id) {
      return get(state, '0', {
        id: '',
        isOpen: false,
      });
    }

    return cloneDeep(_modal);
  }, [state]);

  const setIsOpen = useCallback(
    (isOpen: boolean, modalState: Partial<TModalProps> = {}) => {
      if (!id) {
        console.warn('useModal called without id');
        return;
      }
      if (!modal) {
        console.warn(`Modal with id ${id} not found.`);
        return;
      }

      addUpdateState({
        ...modalState,
        id: modal.id,
        isOpen,
      });
    },
    [state]
  );

  const toggleIsOpen = useCallback(() => {
    if (!id) {
      console.warn('useModal called without id');
      return;
    }
    if (!modal) {
      console.warn(`Modal with id ${id} not found.`);
      return;
    }

    addUpdateState({
      isOpen: !modal.isOpen,
      id: modal.id,
    });
  }, [state]);

  return { ...modal, setIsOpen, toggleIsOpen };
};
