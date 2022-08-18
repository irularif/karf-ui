import { Image as NativeImage } from 'react-native';
import BaseImage from './Image';
import { ImageZoom } from './ImageZoom';

export const Image = Object.assign(BaseImage, {
  getSize: NativeImage.getSize,
  getSizeWithHeaders: NativeImage.getSizeWithHeaders,
  abortPrefetch: NativeImage.abortPrefetch,
  prefetch: NativeImage.prefetch,
  prefetchWithMetadata: NativeImage.prefetchWithMetadata,
  queryCache: NativeImage.queryCache,
  resolveAssetSource: NativeImage.resolveAssetSource,
  Zoom: ImageZoom,
});
