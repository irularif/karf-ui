import * as FileSystem from 'expo-file-system';
import { cloneDeep, get, isEqual } from 'lodash';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image as NativeImage,
  ImageProps as NativeImageProps,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { Appbar } from '../Appbar';
import { Button } from '../Button';
import { renderNode, RNFunctionComponent } from '../helpers';
import { getStorage, setStorage } from '../helpers/storage';
import withConfig from '../helpers/withConfig';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Shimmer } from '../Shimmer';
import { View } from '../View';
import { ImageZoom } from './ImageZoom';

interface ImageState {
  originalSource?: ImageSourcePropType;
  source?: ImageSourcePropType;
  isError: boolean;
  visiblePreview: boolean;
  width: number;
  height: number;
}

export interface ImageProps extends NativeImageProps {
  enablePreview?: boolean;
  variant?: 'default' | 'rounded' | 'circle';
  ErrorComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
  children?: React.ReactNode;
}

const dirs = FileSystem.cacheDirectory + 'images/';

const checkImageInCache = async (uri: string) => {
  try {
    return await FileSystem.getInfoAsync(uri);
  } catch (err) {
    return false;
  }
};

const BaseImage: RNFunctionComponent<ImageProps> = forwardRef(
  (
    {
      variant = 'default',
      source,
      style,
      ErrorComponent,
      theme,
      enablePreview = false,
      children,
      ...props
    },
    _
  ) => {
    const downloadRef = useRef<FileSystem.DownloadResumable | undefined>();
    const imageState = useState<ImageState>({
      originalSource: undefined,
      source: undefined,
      isError: false,
      visiblePreview: false,
      width: 0,
      height: 0,
    });
    const [state, setState] = imageState;
    const { width } = Dimensions.get('window');

    const getCacheData = useCallback(async () => {
      const cacheStr = await getStorage('imageCache');
      if (cacheStr) {
        return JSON.parse(cacheStr);
      }
      return {};
    }, []);

    const _source = useMemo(() => {
      if (typeof state.source === 'string') {
        return { uri: state.source };
      } else if (typeof state.source === 'number') {
        return state.source;
      }
      return source;
    }, [state, source]);

    const checkCache = useCallback(async () => {
      const source = cloneDeep(state.originalSource);
      if (typeof source === 'object') {
        let fileName = '';
        let localUri = '';
        let uri = '';
        let headers = {};
        if (Array.isArray(source)) {
          headers = get(source, '0.headers', {});
          uri = get(source, '0.uri', '');
          fileName = get(source, '0.uri', '')
            .replace(/^.*[\\\/]/, '')
            .replace(/[/\\?%*:|"<>]/g, '-');
          localUri = dirs + fileName;
        } else if (!Array.isArray(source)) {
          headers = get(source, 'headers', {});
          uri = get(source, 'uri', '');
          fileName = uri.replace(/^.*[\\\/]/, '').replace(/[/\\?%*:|"<>]/g, '-');
          localUri = dirs + fileName;
        }
        if (uri.startsWith('http')) {
          const cache = await checkImageInCache(localUri);
          if (!!cache && !!cache?.exists) {
            const { width, height } = NativeImage.resolveAssetSource({ uri: localUri });
            setState((prev) => ({ ...prev, source: { uri: localUri }, width, height }));
          } else {
            const cacheData = await getCacheData();
            let download = undefined;
            const downloadSnapshot = cacheData[uri];
            if (!!downloadSnapshot) {
              download = new FileSystem.DownloadResumable(
                downloadSnapshot.url,
                downloadSnapshot.fileUri,
                downloadSnapshot.options,
                undefined,
                downloadSnapshot.resumeData
              );
            } else {
              download = FileSystem.createDownloadResumable(uri, localUri, {
                cache: false,
                headers,
              });
            }
            if (!!download) {
              downloadRef.current = download;
            }
            download
              .downloadAsync()
              .then((res) => {
                if (res?.uri) {
                  const { width, height } = NativeImage.resolveAssetSource({ uri: localUri });
                  setState((prev) => ({ ...prev, source: { uri: res.uri }, width, height }));
                  if (!!downloadSnapshot) {
                    delete cacheData[uri];
                    setStorage('imageCache', JSON.stringify(cacheData));
                  }
                }
              })
              .catch(() => {
                setState((prev) => ({ ...prev, isError: true }));
              })
              .finally(() => {
                downloadRef.current = undefined;
              });
          }
        } else {
          const { width, height } = NativeImage.resolveAssetSource({ uri });
          setState((prev) => ({ ...prev, source: { uri: uri }, width, height }));
        }
      } else if (!!source) {
        const { width, height } = NativeImage.resolveAssetSource(source);
        setState((prev) => ({ ...prev, source: source, width, height }));
      }
    }, [state]);

    const pauseDownload = useCallback(async () => {
      if (!!downloadRef.current) {
        downloadRef.current.pauseAsync();
        const data = downloadRef.current.savable();
        const cacheData = await getCacheData();
        cacheData[data.url] = data;
        setStorage('imageCache', JSON.stringify(cacheData));
      }
    }, [downloadRef, getCacheData]);

    const togglePreview = useCallback(() => {
      setState((prev) => ({ ...prev, visiblePreview: !prev.visiblePreview }));
    }, []);

    useEffect(() => {
      checkCache();
    }, [state.originalSource]);

    useEffect(() => {
      if (!isEqual(source, state.originalSource)) {
        setState((prev) => ({ ...prev, originalSource: source }));
      }

      return () => {
        pauseDownload();
      };
    }, [source, state.originalSource]);

    const finalStyle = StyleSheet.flatten([styles.image]);
    const finalContainerButtonStyle = StyleSheet.flatten([
      styles.container,
      styles[variant],
      state.isError && {
        backgroundColor: theme?.colors?.error,
      },
      style,
    ]);
    const finalButtonStyle = StyleSheet.flatten([
      styles.image,
      {
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
      state.isError && {
        backgroundColor: theme?.colors?.error,
      },
      style,
    ]);
    const finalModalStyle = StyleSheet.flatten([styles.modal]);
    const finalCloseButtonStyle = StyleSheet.flatten([
      {
        backgroundColor: theme?.colors?.white,
      },
    ]);

    return (
      <>
        <Button
          disabled={!enablePreview || state.isError || !state.source}
          containerStyle={finalContainerButtonStyle}
          style={finalButtonStyle}
          onPress={togglePreview}
        >
          {state.isError ? (
            !!ErrorComponent ? (
              renderNode(ErrorComponent, true)
            ) : (
              <View style={styles.image}>
                <Icon
                  name="image-broken"
                  type="material-community"
                  size={45}
                  color={theme?.colors.divider}
                />
              </View>
            )
          ) : !!state.source ? (
            <NativeImage source={state.source} style={finalStyle} {...props} />
          ) : !!children ? (
            renderNode(children, true)
          ) : (
            <Shimmer style={styles.image} />
          )}
        </Button>
        <Modal
          position="full"
          contentContainerStyle={finalModalStyle}
          statusBar={{
            barStyle: 'light-content',
          }}
          isOpen={state.visiblePreview}
        >
          <ImageZoom imageWidth={width} imageHeight={(width * state.height) / state.width}>
            <NativeImage source={_source} style={finalStyle} {...props} />
          </ImageZoom>
          <Appbar backgroundColor="#0000" containerStyle={styles.appbar} insetTop>
            <Appbar.Title />
            <Appbar.RightAction>
              <Button.Icon
                name="close"
                size={24}
                variant="tonal"
                style={finalCloseButtonStyle}
                onPress={togglePreview}
                shadow
              />
            </Appbar.RightAction>
          </Appbar>
        </Modal>
      </>
    );
  }
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 42,
    height: 42,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rounded: {
    borderRadius: 16,
  },
  circle: {
    borderRadius: 9999,
  },
  default: {
    borderRadius: 4,
  },
  modal: {
    backgroundColor: '#000',
  },
  appbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

BaseImage.displayName = 'Image';
export default withConfig(BaseImage);
