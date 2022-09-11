import * as FileSystem from 'expo-file-system';
import { cloneDeep, get, isEqual } from 'lodash';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image as NativeImage,
  ImageProps as NativeImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import { Appbar } from '../Appbar';
import { Button } from '../Button';
import { renderNode, RNFunctionComponent } from '../helpers';
import { getStorage, setStorage } from '../helpers/storage';
import withConfig from '../helpers/withConfig';
import useImage from '../hooks/image';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Shimmer } from '../Shimmer';
import type { ITheme } from '../ThemeProvider/context';
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

interface ImagePreviewProps {
  enablePreview?: boolean;
  imageState: [ImageState, React.Dispatch<React.SetStateAction<ImageState>>];
  style: StyleProp<ImageStyle>;
  theme?: ITheme;
}

interface ImageRenderProps extends Partial<ImageProps> {
  imageState: [ImageState, React.Dispatch<React.SetStateAction<ImageState>>];
  theme?: ITheme;
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
  ({ variant = 'default', source, style, theme, enablePreview = false, ...props }, _) => {
    const imageState = useState<ImageState>({
      originalSource: undefined,
      source: undefined,
      isError: false,
      visiblePreview: false,
      width: 0,
      height: 0,
    });
    const [state, setState] = imageState;
    const { add } = useImage();

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
        } else if (!Array.isArray(source)) {
          headers = get(source, 'headers', {});
          uri = get(source, 'uri', '');
        }
        if (!uri) return;
        if (uri.startsWith('http')) {
          fileName = uri.replace(/^.*[\\\/]/, '').replace(/[/\\?%*:|"<>]/g, '-');
          localUri = dirs + fileName;
          add({
            url: uri,
            localUri,
            options: {
              headers,
            },
          }).then((res) => {
            if (!!res) {
              if (res.status === 'success') {
                NativeImage.getSize(res.localUri, (width, height) => {
                  setState((prev) => ({
                    ...prev,
                    source: {
                      uri: res.localUri,
                    },
                    width,
                    height,
                  }));
                });
              }
            }
          });
        } else {
          const { width, height } = NativeImage.resolveAssetSource({ uri });
          setState((prev) => ({ ...prev, source: { uri: uri }, width, height }));
        }
      }
    }, [state]);

    const togglePreview = useCallback(() => {
      setState((prev) => ({ ...prev, visiblePreview: !prev.visiblePreview }));
    }, []);

    useEffect(() => {
      checkCache();
    }, [state.originalSource]);

    useEffect(() => {
      if (!!source) {
        if (typeof source === 'object') {
          setState((prev) => {
            if (!isEqual(source, prev.originalSource)) {
              return {
                ...prev,
                originalSource: source,
              };
            }
            return prev;
          });
        } else {
          setState((prev) => {
            if (source !== state.originalSource) {
              const { width, height } = NativeImage.resolveAssetSource(source);
              return {
                ...prev,
                originalSource: source,
                source: source,
                width,
                height,
              };
            }
            return prev;
          });
        }
      }
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

    return (
      <>
        <Button
          disabled={!enablePreview || state.isError || !state.source}
          containerStyle={finalContainerButtonStyle}
          style={finalButtonStyle}
          onPress={togglePreview}
        >
          <RenderImage {...props} theme={theme} style={finalStyle} imageState={imageState} />
        </Button>
        <ImagePreview
          theme={theme}
          imageState={imageState}
          style={finalStyle}
          enablePreview={enablePreview}
        />
      </>
    );
  }
);

const RenderImage = ({
  theme,
  ErrorComponent,
  children,
  imageState,
  style,
  ...props
}: ImageRenderProps) => {
  const [state] = imageState;

  return (
    <>
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
        <NativeImage source={state.source} style={style} {...props} />
      ) : !!children ? (
        renderNode(children, true)
      ) : (
        <Shimmer style={styles.image} />
      )}
    </>
  );
};

const ImagePreview = ({ theme, imageState, style, enablePreview }: ImagePreviewProps) => {
  const [state, setState] = imageState;
  const { width } = Dimensions.get('window');

  const finalModalStyle = StyleSheet.flatten([styles.modal]);
  const finalCloseButtonStyle = StyleSheet.flatten([
    {
      backgroundColor: theme?.colors?.white,
    },
  ]);

  const togglePreview = useCallback(() => {
    setState((prev) => ({ ...prev, visiblePreview: !prev.visiblePreview }));
  }, []);

  if (!!enablePreview && !!state.source) {
    return (
      <Modal
        position="full"
        contentContainerStyle={finalModalStyle}
        statusBar={{
          barStyle: 'light-content',
        }}
        isOpen={state.visiblePreview}
      >
        <ImageZoom imageWidth={width} imageHeight={(width * state.height) / state.width}>
          <NativeImage source={state.source} style={style} />
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
    );
  }

  return null;
};

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
