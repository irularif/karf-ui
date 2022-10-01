import SHA1 from 'crypto-js/sha1';
import type { DownloadOptions } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import { uniqBy, uniqueId } from 'lodash';
import { waitUntil } from './waitUntil';

type CacheEntryStatus = 'queue' | 'downloading' | 'success' | 'failed';

const BASE_DIR = `${FileSystem.cacheDirectory}file-cache/`;
export class CacheEntry {
  id: string;
  uri: string;
  options: DownloadOptions;
  status: CacheEntryStatus;
  path: string = '';
  progress: number = 0;
  error: unknown = undefined;

  private downloadRef: FileSystem.DownloadResumable | undefined = undefined;

  constructor(uri: string, options: DownloadOptions) {
    this.id = uniqueId();
    this.uri = uri;
    this.options = options;
    this.status = 'queue';
  }

  private downloadCallback(downloadProgress: FileSystem.DownloadProgressData) {
    const progress =
      downloadProgress?.totalBytesWritten / downloadProgress?.totalBytesExpectedToWrite;
    this.progress = progress;
  }

  async download() {
    try {
      const { uri, options } = this;
      const { path, exists, tmpPath } = await getCacheEntry(uri);
      if (exists) {
        this.path = path;
        this.status = 'success';
        return;
      }
      let ref = FileSystem.createDownloadResumable(uri, tmpPath, options, (downloadProgress) => {
        const progress =
          downloadProgress?.totalBytesWritten / downloadProgress?.totalBytesExpectedToWrite;
        this.progress = progress;
      });
      let result = undefined;
      if (!!this.downloadRef) {
        ref = this.downloadRef;
        result = await ref.resumeAsync();
      } else {
        this.downloadRef = ref;
        result = await ref.downloadAsync();
      }

      if (result && result.status >= 200 && result.status <= 300 && result.uri) {
        await FileSystem.moveAsync({ from: tmpPath, to: path });
        if (!this.path) {
          this.path = path;
        }
        this.status = 'success';
      } else {
        this.status = 'failed';
      }
      this.downloadRef = undefined;
    } catch (error) {
      this.error = error;
    }
  }

  pauseDownload() {
    if (!!this.downloadRef) {
      this.downloadRef.pauseAsync();
    }
  }

  cancelDownload() {
    if (!!this.downloadRef) {
      this.downloadRef.cancelAsync();
    }
  }

  saveDownload() {
    if (!!this.downloadRef) {
      this.downloadRef.savable();
    }
  }

  resumeDownload(snapshot?: FileSystem.DownloadPauseState) {
    if (!!this.downloadRef) {
      this.downloadRef.resumeAsync();
    } else if (!!snapshot) {
      this.downloadRef = new FileSystem.DownloadResumable(
        snapshot.url,
        snapshot.fileUri,
        snapshot.options,
        this.downloadCallback,
        snapshot.resumeData
      );
      this.download();
    }
  }
}

export class CacheItem {
  id: string = uniqueId();
  cache: CacheEntry;
  private reject: (reason?: any) => void = () => {};

  constructor(cache: CacheEntry) {
    this.cache = cache;
  }

  cancelSubscription() {
    this.reject({
      canceled: true,
    });
  }

  async getPath(): Promise<string | undefined> {
    return new Promise(async (resolve, reject) => {
      this.reject = reject;
      if (this.cache.path) {
        resolve(this.cache.path);
        return;
      }
      await waitUntil(() => !!this.cache.path || this.cache.status === 'failed');
      if (this.cache.path) {
        resolve(this.cache.path);
      } else {
        reject(this.cache.error);
      }
    });
  }
}

export default class CacheManager {
  private static maxQueue = 10;
  private static status: 'stop' | 'run' = 'stop';
  private static entries: Array<CacheEntry> = [];

  private static get queue(): Array<CacheEntry> {
    return CacheManager.entries.filter((x) => x.status === 'queue');
  }
  private static get downloading(): Array<CacheEntry> {
    return CacheManager.entries.filter((x) => x.status === 'downloading');
  }

  private static async run() {
    const countDownloading = CacheManager.downloading.length;
    const countQueue = CacheManager.queue.length;
    let countPushDownload = CacheManager.maxQueue - countDownloading;
    if (countPushDownload > countQueue) {
      countPushDownload = countQueue;
    }
    if ((!countPushDownload && !countQueue) || CacheManager.status === 'stop') return;
    else if (!countPushDownload && !!countQueue) {
      setTimeout(() => {
        CacheManager.run();
      }, 1000);
    }
    uniqBy(CacheManager.queue, 'uri')
      .slice(0, countPushDownload)
      .forEach((item) => {
        item.status = 'downloading';
        item.download();
      });
    if (!CacheManager.downloading.length) {
      CacheManager.status = 'stop';
    } else {
      setTimeout(() => {
        CacheManager.run();
      }, 1000);
    }
  }

  static async init() {
    const dirInfo = await FileSystem.getInfoAsync(BASE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(BASE_DIR, { intermediates: true });
    }
  }

  private static getEntry(uri: string) {
    return CacheManager.entries.find((x) => x.uri === uri);
  }

  static get(uri: string, options: DownloadOptions): CacheItem {
    let entry = CacheManager.getEntry(uri);
    if (!entry) {
      entry = new CacheEntry(uri, options);
      CacheManager.entries.push(entry);
      if (CacheManager.status === 'stop') {
        CacheManager.status = 'run';
        CacheManager.run();
      }
    }
    let cache = new CacheItem(entry);
    return cache;
  }

  static async clearCache(): Promise<void> {
    await FileSystem.deleteAsync(BASE_DIR, { idempotent: true });
    await FileSystem.makeDirectoryAsync(BASE_DIR);
  }

  static async getCacheSize(): Promise<number> {
    const result = await FileSystem.getInfoAsync(BASE_DIR);
    if (!result.exists) {
      throw new Error(`${BASE_DIR} not found`);
    }
    return result.size;
  }

  static async cancelProcess() {
    CacheManager.status = 'stop';
    CacheManager.downloading.forEach((entry) => {
      entry.cancelDownload();
    });
  }
}

const getCacheEntry = async (
  uri: string
): Promise<{ exists: boolean; path: string; tmpPath: string }> => {
  const filename = uri.substring(
    uri.lastIndexOf('/'),
    uri.indexOf('?') === -1 ? uri.length : uri.indexOf('?')
  );
  const ext = filename.indexOf('.') === -1 ? '.jpg' : filename.substring(filename.lastIndexOf('.'));
  const path = `${BASE_DIR}${SHA1(uri)}${ext}`;
  const tmpPath = `${BASE_DIR}${SHA1(uri)}-${uniqueId()}${ext}`;
  const info = await FileSystem.getInfoAsync(path);
  return { exists: !!info?.exists, path, tmpPath };
};
