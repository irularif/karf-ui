import type * as FileSystem from 'expo-file-system';
import { cloneDeep } from 'lodash';
import { createContext } from 'react';
import type { CancellablePromise } from '../helpers';

type TStatus = 'queue' | 'downloading' | 'error' | 'success';

export interface ImageCacheState {
  url: string;
  localUri: string;
  options?: FileSystem.DownloadOptions;
}

export interface QueueImageCacheState extends ImageCacheState {
  status?: TStatus;
  progress?: number;
  downloadRef?: FileSystem.DownloadResumable;
  downloadSnapShot?: FileSystem.DownloadPauseState;
  isCached?: boolean;
}

export enum ImageCacheAction {
  ADD,
  UPDATE_STATUS,
  UPDATE_PROGRESS,
  UPDATE_CALLBACK,
  UPDATE,
}

type Payload =
  | {
      action: ImageCacheAction.ADD;
      data: QueueImageCacheState;
    }
  | {
      action: ImageCacheAction.UPDATE;
      data: Partial<QueueImageCacheState>;
    }
  | {
      action: ImageCacheAction.UPDATE_STATUS;
      data: Pick<QueueImageCacheState, 'url' | 'status'>;
    }
  | {
      action: ImageCacheAction.UPDATE_PROGRESS;
      data: Pick<QueueImageCacheState, 'url' | 'progress'>;
    };

const add = (state: Array<QueueImageCacheState>, data: QueueImageCacheState) => {
  let nstate = cloneDeep(state);
  const idx = nstate.findIndex((x) => x.url === data.url);
  if (idx > -1) {
    nstate = update(nstate, data);
  } else {
    nstate.push({
      ...data,
      status: 'queue',
      progress: 0,
    });
  }
  return nstate;
};

const update = (state: Array<QueueImageCacheState>, data: Partial<QueueImageCacheState>) => {
  const nstate = cloneDeep(state);
  const idx = nstate.findIndex((x) => x.url === data.url);
  if (idx > -1) {
    nstate[idx] = Object.assign({}, nstate[idx], data);
  }
  return nstate;
};

const updateStatus = (
  state: Array<QueueImageCacheState>,
  data: Pick<QueueImageCacheState, 'url' | 'status'>
) => {
  const nstate = cloneDeep(state);
  const idx = nstate.findIndex((x) => x.url === data.url);
  if (idx > -1) {
    nstate[idx].status = data.status;
  }
  return nstate;
};

const updateProgress = (
  state: Array<QueueImageCacheState>,
  data: Pick<QueueImageCacheState, 'url' | 'progress'>
) => {
  const nstate = cloneDeep(state);
  const idx = nstate.findIndex((x) => x.url === data.url);
  if (idx > -1) {
    nstate[idx].progress = data.progress;
  }
  return nstate;
};

export const InitialQueueImage: Array<QueueImageCacheState> = [];

export const reducer = (
  state: Array<QueueImageCacheState> = InitialQueueImage,
  payload: Payload
) => {
  switch (payload.action) {
    case ImageCacheAction.ADD:
      return add(state, payload.data);
    case ImageCacheAction.UPDATE:
      return update(state, payload.data);
    case ImageCacheAction.UPDATE_STATUS:
      return updateStatus(state, payload.data);
    case ImageCacheAction.UPDATE_PROGRESS:
      return updateProgress(state, payload.data);
    default:
      return state;
  }
};

interface QueueImageDispatch {
  add: (data: ImageCacheState) => CancellablePromise<QueueImageCacheState>;
  getQueue: (url: string) => QueueImageCacheState | undefined;
  getStatusQueue: (url: string) => TStatus | undefined;
  checkImageInCache: (url: string) => Promise<false | FileSystem.FileInfo>;
}

export const QueueImageContext = createContext<Array<QueueImageCacheState>>([]);
export const QueueImageDispatchContext = createContext<QueueImageDispatch | undefined>(undefined);
