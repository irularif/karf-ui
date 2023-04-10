import SHA1 from 'crypto-js/sha1';
import type { DownloadOptions } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import { uniqBy, uniqueId } from 'lodash';
import { Image } from 'react-native';
import { waitUntil } from './waitUntil';

type CacheEntryStatus = 'queue' | 'downloading' | 'success' | 'failed';

const BASE_DIR = `${FileSystem.cacheDirectory}file-cache/`;
export class CacheEntry {
  ready: boolean = false;
  uri: string;
  options: DownloadOptions;
  status: CacheEntryStatus;
  path: string = '';
  progress: number = 0;
  error: unknown = undefined;
  width: number = 0;
  height: number = 0;
  size: number = 0;
  modificationTime: number = 0;

  private _callback: Record<string, (value: CacheEntry) => void> = {};
  private _path: string = '';
  private _tempPath: string = '';
  private _downloadRef: FileSystem.DownloadResumable | undefined = undefined;

  constructor(uri: string, options: DownloadOptions) {
    this.uri = uri;
    this.options = options;
    this.status = 'queue';
    this.init(uri);
  }

  private init(uri: string) {
    const filename = uri.substring(
      uri.lastIndexOf('/'),
      uri.indexOf('?') === -1 ? uri.length : uri.indexOf('?')
    );
    const ext =
      filename.indexOf('.') === -1 ? '.jpg' : filename.substring(filename.lastIndexOf('.'));
    const _path = `${BASE_DIR}${SHA1(uri)}${ext}`;
    const _tempPath = `${BASE_DIR}${SHA1(uri)}-${uniqueId()}${ext}`;
    this._path = _path;
    this._tempPath = _tempPath;
    this.ready = true;
    this.checkCached();
  }

  private async checkCached() {
    try {
      const { _path: path } = this;
      const info = await FileSystem.getInfoAsync(path);
      if (!!info && !!info.exists) {
        const { size, modificationTime } = info;
        await Image.getSize(path, (width, height) => {
          this.height = height;
          this.width = width;
        });
        this.size = size;
        this.modificationTime = modificationTime;
        this.path = path;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  private downloadCallback(downloadProgress: FileSystem.DownloadProgressData) {
    const progress =
      downloadProgress?.totalBytesWritten / downloadProgress?.totalBytesExpectedToWrite;
    this.progress = progress;
  }

  async download() {
    try {
      const { uri, options, _path: path, status, _tempPath: tempPath } = this;
      if (!!path && status === 'success') {
        return;
      }

      let ref = FileSystem.createDownloadResumable(uri, tempPath, options, (downloadProgress) => {
        const progress =
          downloadProgress?.totalBytesWritten / downloadProgress?.totalBytesExpectedToWrite;
        this.progress = progress;
      });
      let result = undefined;
      if (!!this._downloadRef) {
        ref = this._downloadRef;
        result = await ref.resumeAsync();
      } else {
        this._downloadRef = ref;
        result = await ref.downloadAsync();
      }

      if (result && result.status >= 200 && result.status < 300 && result.uri) {
        await FileSystem.moveAsync({ from: tempPath, to: path });
        await Image.getSize(path, (width, height) => {
          this.height = height;
          this.width = width;
        });
        const info = await FileSystem.getInfoAsync(path);
        this.size = info.size || 0;
        this.modificationTime = info.modificationTime || 0;
        this.path = path;
        this.error = undefined;
        this.status = 'success';
      } else {
        this.status = 'failed';
      }
      this._downloadRef = undefined;
      Object.values(this._callback).forEach((fn) => fn(this));
    } catch (error) {
      console.warn(error);
      this.status = 'failed';
      this._downloadRef = undefined;
      this.error = error;
      Object.values(this._callback).forEach((fn) => fn(this));
    }
  }

  pauseDownload() {
    if (!!this._downloadRef) {
      this._downloadRef.pauseAsync();
    }
  }

  cancelDownload() {
    if (!!this._downloadRef) {
      this._downloadRef.cancelAsync();
    }
  }

  saveDownload() {
    if (!!this._downloadRef) {
      this._downloadRef.savable();
    }
  }

  resumeDownload(snapshot?: FileSystem.DownloadPauseState) {
    if (!!this._downloadRef) {
      this._downloadRef.resumeAsync();
    } else if (!!snapshot) {
      this._downloadRef = new FileSystem.DownloadResumable(
        snapshot.url,
        snapshot.fileUri,
        snapshot.options,
        this.downloadCallback,
        snapshot.resumeData
      );
      this.download();
    }
  }

  registerCallback(key: string, callback: (value: CacheEntry) => void) {
    this._callback[key] = callback;
  }

  deleteCallback(key: string) {
    delete this._callback[key];
  }
}

export class CacheItem {
  id: string = uniqueId();
  cache: CacheEntry;
  private callback: (value: CacheEntry | undefined) => void = () => {};

  constructor(cache: CacheEntry, callback: (res: CacheEntry | undefined) => void) {
    this.cache = cache;
    this.callback = callback;
    this.cache.registerCallback(this.id, callback);
    this.init();
  }

  private async init() {
    await waitUntil(() => this.cache.ready);
    this.callback(this.cache);
  }

  cancelSubscription() {
    this.cache.deleteCallback(this.id);
    this.callback(undefined);
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
  private static runEntry(uri: string) {
    const idx = CacheManager.entries.findIndex((x) => x.uri === uri);
    if (idx > -1) {
      CacheManager.entries[idx].status = 'downloading';
      CacheManager.entries[idx].download();
    }
  }

  private static async run() {
    const countDownloading = CacheManager.downloading.length;
    const countQueue = CacheManager.queue.length;
    let countPushDownload = CacheManager.maxQueue - countDownloading;
    if (countPushDownload > countQueue) {
      countPushDownload = countQueue;
    }
    if ((!countPushDownload && !countQueue) || CacheManager.status === 'stop') {
      CacheManager.status = 'stop';
      return;
    }
    await waitUntil(() => CacheManager.downloading.length < CacheManager.maxQueue);
    uniqBy(CacheManager.queue, 'uri')
      .slice(0, countPushDownload)
      .forEach((item) => {
        CacheManager.runEntry(item.uri);
      });
    CacheManager.run();
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

  static get(
    uri: string,
    options: DownloadOptions,
    callback: (cache: CacheEntry | undefined) => void
  ): CacheItem {
    let entry = CacheManager.getEntry(uri);
    if (!entry) {
      entry = new CacheEntry(uri, options);
      CacheManager.entries.push(entry);
      if (CacheManager.status === 'stop') {
        CacheManager.status = 'run';
        CacheManager.run();
      }
    }
    let cache = new CacheItem(entry, callback);
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
