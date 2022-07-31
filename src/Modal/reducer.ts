import { cloneDeep, merge } from 'lodash';
import type { TModalOriginProps } from './context';

export enum ModalActions {
  ADD_UPDATE_MODAL,
  REMOVE_MODAL,
}

interface AddUpdateModal {
  type: ModalActions.ADD_UPDATE_MODAL;
  payload: TModalOriginProps;
}

interface RemoveModal {
  type: ModalActions.REMOVE_MODAL;
  payload: Partial<TModalOriginProps>;
}

export type ActionTypes = AddUpdateModal | RemoveModal;

const addUpdateModal = (
  clonedState: Array<TModalOriginProps>,
  modal: Partial<TModalOriginProps>
) => {
  if (!modal.id) {
    return clonedState;
  }
  const idx = clonedState.findIndex((item) => item.id === modal.id);
  if (idx > -1) {
    clonedState[idx] = merge(
      {
        isOpen: false,
      },
      modal,
      {
        id: modal.id,
      }
    );
  } else {
    clonedState.push({
      isOpen: false,
      ...modal,
      id: modal.id,
    });
  }
  return clonedState;
};

const removeModal = (clonedState: Array<TModalOriginProps>, modal: Partial<TModalOriginProps>) => {
  const idx = clonedState.findIndex((item) => item.id === modal.id);
  if (idx > -1) {
    clonedState.splice(idx, 1);
  }
  return clonedState;
};

export const modalReducer = (state: Array<TModalOriginProps>, action: ActionTypes) => {
  const { type } = action;
  let clonedState = cloneDeep(state);

  switch (type) {
    case ModalActions.ADD_UPDATE_MODAL:
      return addUpdateModal(clonedState, action.payload);
    case ModalActions.REMOVE_MODAL:
      return removeModal(clonedState, action.payload);
    default:
      return state;
  }
};
