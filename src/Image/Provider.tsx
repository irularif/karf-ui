import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { cloneDeep, reject } from 'lodash';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { CancellablePromise } from '../helpers';
import {
  ImageCacheAction,
  ImageCacheState,
  InitialQueueImage,
  QueueImageCacheState,
  QueueImageContext,
  QueueImageDispatchContext,
  reducer,
} from './context';

const checkImageInCache = async (uri: string) => {
  try {
    return await FileSystem.getInfoAsync(uri);
  } catch (err) {
    return false;
  }
};

const ImageProvider = ({ children }: any) => {
  const maxDownloading = 10;
  const [queueList, dispatch] = useReducer(reducer, InitialQueueImage);
  const callbackRef = useRef<Record<string, Array<Function>>>({});
  const callbackList = callbackRef.current;

  const downloadingList = useMemo(
    () => queueList.filter((x) => x.status === 'downloading'),
    [queueList]
  );
  const waitingList = useMemo(() => queueList.filter((x) => x.status === 'queue'), [queueList]);
  const completeList = useMemo(
    () => queueList.filter((x) => x.status === 'success' || x.status === 'error'),
    [queueList]
  );

  const downloadImage = useCallback(
    async (data: QueueImageCacheState) => {
      const ndata = cloneDeep(data);
      ndata.status = 'downloading';
      dispatch({
        action: ImageCacheAction.UPDATE_STATUS,
        data: ndata,
      });
      const cache = await checkImageInCache(ndata.localUri);
      if (!!cache && !!cache?.exists) {
        const res = await fetch(data.url, {
          method: 'HEAD',
        });
        const fileSize = res.headers.get('Content-Length');
        if (!!fileSize && Number(fileSize) === cache.size) {
          ndata.status = 'success';
          dispatch({
            action: ImageCacheAction.UPDATE,
            data: {
              url: ndata.url,
              status: 'success',
              isCached: true,
            },
          });
          return;
        }
      }
      let download: FileSystem.DownloadResumable | undefined = undefined;
      if (!!data.downloadSnapShot) {
        const downloadSnapshot = data.downloadSnapShot;
        download = new FileSystem.DownloadResumable(
          downloadSnapshot.url,
          downloadSnapshot.fileUri,
          downloadSnapshot.options,
          undefined,
          downloadSnapshot.resumeData
        );
      } else {
        download = FileSystem.createDownloadResumable(
          encodeURI(data.url),
          data.localUri,
          Object.assign(
            {
              cache: false,
            },
            data.options
          )
        );
      }
      if (!!download) {
        ndata.downloadRef = download;
        dispatch({
          action: ImageCacheAction.UPDATE,
          data: {
            url: ndata.url,
            status: ndata.status,
            downloadRef: ndata.downloadRef,
          },
        });
      }
      download
        .downloadAsync()
        .then((res) => {
          if (!!res?.status && res?.status >= 200 && res?.status < 300) {
            ndata.status = 'success';
          } else {
            ndata.status = 'error';
          }
        })
        .catch((e) => {
          ndata.status = 'error';
        })
        .finally(() => {
          dispatch({
            action: ImageCacheAction.UPDATE_STATUS,
            data: ndata,
          });
        });
    },
    [dispatch]
  );

  const runQueue = useCallback(() => {
    if (downloadingList.length === maxDownloading) return;
    if (downloadingList.length < maxDownloading && !!waitingList.length) {
      let numDownload =
        waitingList.length > maxDownloading - downloadingList.length
          ? maxDownloading - downloadingList.length
          : waitingList.length;
      let _queue = waitingList.splice(0, numDownload);
      _queue.forEach((data) => {
        downloadImage(data);
      });
    }
  }, [downloadingList, waitingList]);

  const cleanDownload = useCallback(async () => {
    let list = [];
    for (let data of downloadingList) {
      const ndata = cloneDeep(data);
      await data.downloadRef?.pauseAsync();
      ndata.downloadSnapShot = data.downloadRef?.savable();
      list.push(ndata);
      dispatch({
        action: ImageCacheAction.UPDATE,
        data: {
          url: data.url,
          downloadSnapShot: ndata.downloadSnapShot,
        },
      });
    }
    AsyncStorage.setItem('images', JSON.stringify(list));
  }, [downloadingList]);

  const getFromStorage = useCallback(async () => {
    const downloadingListStr = await AsyncStorage.getItem('images');
    if (!!downloadingListStr) {
      const downloadingList = JSON.parse(downloadingListStr);
      for (let data of downloadingList) {
        dispatch({
          action: ImageCacheAction.UPDATE,
          data: {
            ...data,
            status: 'queue',
          },
        });
      }
    }
  }, []);

  const getQueue = useCallback(
    (url: string) => {
      return queueList.find((x) => x.url === url);
    },
    [queueList]
  );
  const getCompleteQueue = useCallback(
    (url: string) => {
      return completeList.find((x) => x.url === url);
    },
    [completeList]
  );

  const getStatusQueue = useCallback(
    (url: string) => {
      const queue = getQueue(url);
      if (!!queue) {
        return queue.status;
      }
      return undefined;
    },
    [getQueue]
  );

  const add = useCallback((data: ImageCacheState): CancellablePromise<QueueImageCacheState> => {
    return new CancellablePromise((resolve) => {
      dispatch({
        action: ImageCacheAction.ADD,
        data,
      });
      const ndata = cloneDeep(callbackList);
      if (!ndata[data.url]) {
        ndata[data.url] = [];
      }
      ndata[data.url].push(resolve);
      callbackRef.current = ndata;
      checkImageInCache(data.localUri)
        .then((res) => {
          if (!!res && !!res.exists) {
            resolve({
              localUri: data.localUri,
              url: data.url,
              status: 'success',
            });
          }
        })
        .catch(() => {
          reject(null);
        });
    });
  }, []);

  const _dispatch = useMemo(() => {
    return {
      add,
      getQueue,
      getStatusQueue,
      checkImageInCache,
    };
  }, []);

  const runComplete = useCallback(() => {
    Object.keys(callbackList).forEach((url) => {
      const image = getCompleteQueue(url);
      if (!!image && !image.isCached) {
        callbackList[url].forEach((c) => c(image));
        const ndata = cloneDeep(callbackList);
        delete ndata[url];
        callbackRef.current = ndata;
      }
    });
  }, [completeList, callbackList]);

  useEffect(() => {
    getFromStorage();

    return () => {
      cleanDownload();
    };
  }, []);

  useEffect(() => {
    runQueue();
  }, [queueList]);

  useEffect(() => {
    runComplete();
  }, [completeList]);

  return (
    <QueueImageDispatchContext.Provider value={_dispatch}>
      <QueueImageContext.Provider value={queueList}>{children}</QueueImageContext.Provider>
    </QueueImageDispatchContext.Provider>
  );
};

export default ImageProvider;
