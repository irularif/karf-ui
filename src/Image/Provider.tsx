import * as FileSystem from 'expo-file-system';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { getStorage, setStorage } from '../helpers/storage';
import {
  ImageCacheAction,
  ImageCacheState,
  InitialQueueImage,
  QueueImageCacheState,
  QueueImageContext,
  QueueImageDispatchContext,
  reducer
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
  const [callback, setCallback] = useState<Record<string, Array<Function>>>({});

  const downloadingList = useMemo(
    () => queueList.filter((x) => x.status === 'downloading'),
    [queueList]
  );
  const waitingList = useMemo(() => queueList.filter((x) => x.status === 'queue'), [queueList]);
  const completeList = useMemo(
    () => queueList.filter((x) => x.status === 'success' || x.status === 'error'),
    [queueList]
  );

  const downloadImage = useCallback(async (data: QueueImageCacheState) => {
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
          action: ImageCacheAction.UPDATE_STATUS,
          data: ndata,
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
  }, []);

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
    setStorage('images', JSON.stringify(list));
  }, [downloadingList]);

  const getFromStorage = useCallback(async () => {
    const downloadingListStr = await getStorage('images');
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

  const add = useCallback((data: ImageCacheState): Promise<QueueImageCacheState | undefined> => {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch({
          action: ImageCacheAction.ADD,
          data,
        });
        setCallback((prev) => {
          const ndata = cloneDeep(prev);
          if (!ndata[data.url]) {
            ndata[data.url] = [];
          }
          ndata[data.url].push((data: QueueImageCacheState) => resolve(data));
          return ndata;
        });
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const _dispatch = useMemo(() => {
    return {
      add,
      getQueue,
      getStatusQueue,
    };
  }, []);

  const runComplete = useCallback(() => {
    Object.keys(callback).forEach((url) => {
      const image = getCompleteQueue(url);
      if (!!image) {
        callback[url].forEach((c) => c(image));
        setCallback((prev) => {
          const ndata = cloneDeep(prev);
          delete ndata[url];
          return ndata;
        });
      }
    });
  }, [completeList, callback]);

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
