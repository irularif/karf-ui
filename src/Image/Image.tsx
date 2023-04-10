import { cloneDeep, get, isEqual } from 'lodash';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image as NativeImage,
  ImageProps as NativeImageProps,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
} from 'react-native';
import type { ITheme } from '../../types/theme';
import { Appbar } from '../Appbar';
import { ButtonIcon } from '../Button';
import { renderNode, RNFunctionComponent } from '../helpers';
import CacheManager from '../helpers/cacheManager';
import withConfig from '../helpers/withConfig';
import { Modal } from '../Modal';
import { Shimmer } from '../Shimmer';
import { defaultTheme } from '../ThemeProvider/context';
import { ImageZoom } from './ImageZoom';

interface ImageState {
  originalSource?: ImageSourcePropType;
  source?: ImageSourcePropType;
  isError: boolean;
  visiblePreview: boolean;
  width: number;
  height: number;
  modificationTime: number;
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
  children?: React.ReactElement;
}

const BaseImage: RNFunctionComponent<ImageProps> = forwardRef(
  (
    { variant = 'default', source, style, theme = defaultTheme, enablePreview = false, ...props },
    _
  ) => {
    const imageState = useState<ImageState>({
      originalSource: undefined,
      source: undefined,
      isError: false,
      visiblePreview: false,
      width: 0,
      height: 0,
      modificationTime: 0,
    });
    const [state, setState] = imageState;

    const checkCache = useCallback(() => {
      const source = cloneDeep(state.originalSource);
      if (typeof source === 'object') {
        let uri = '';
        let headers = {};
        if (Array.isArray(source)) {
          headers = get(source, '0.headers', {});
          uri = get(source, '0.uri', '');
        } else if (!Array.isArray(source)) {
          headers = get(source, 'headers', {});
          uri = get(source, 'uri', '');
        }
        if (!uri) {
          setState((prev) => ({
            ...prev,
            isError: true,
          }));
          return null;
        }
        if (uri.startsWith('http')) {
          const imageCache = CacheManager.get(
            uri,
            {
              headers,
            },
            (res) => {
              if (!!res) {
                if (!!res.path) {
                  setState((prev) => ({
                    ...prev,
                    source: {
                      uri: res.path,
                      cache: 'reload',
                    },
                    width: res.width,
                    height: res.height,
                    modificationTime: res.modificationTime,
                  }));
                } else if (!res.path && !!res.error) {
                  setState((prev) => ({
                    ...prev,
                    isError: true,
                  }));
                }
              }
            }
          );
          return imageCache;
        } else {
          const { width, height } = NativeImage.resolveAssetSource({ uri });
          setState((prev) => ({ ...prev, source: { uri: uri }, width, height }));
        }
      }
      return null;
    }, [state]);

    const togglePreview = useCallback(() => {
      setState((prev) => ({ ...prev, visiblePreview: !prev.visiblePreview }));
    }, []);

    useEffect(() => {
      const imageCache = checkCache();

      return () => {
        imageCache?.cancelSubscription();
      };
    }, [state.originalSource]);

    useEffect(() => {
      setState((prev) => {
        if (!!source) {
          if (typeof source === 'object') {
            if (!isEqual(source, prev.originalSource)) {
              return {
                ...prev,
                originalSource: source,
              };
            }
          } else if (source !== prev.originalSource) {
            const { width, height } = NativeImage.resolveAssetSource(source);
            return {
              ...prev,
              originalSource: source,
              source: source,
              width,
              height,
            };
          }
        }
        return prev;
      });
    }, [source]);

    const finalStyle = StyleSheet.flatten([styles.image]);
    const finalContainerButtonStyle = StyleSheet.flatten([
      styles.container,
      styles[variant],
      {
        backgroundColor: theme?.colors.grey100,
      },
      state.isError && {
        backgroundColor: theme?.colors?.white,
      },
      style,
    ]);

    return (
      <>
        <Pressable
          disabled={!enablePreview || state.isError || !state.source}
          style={finalContainerButtonStyle}
          onPress={togglePreview}
        >
          <RenderImage {...props} theme={theme} style={finalStyle} imageState={imageState} />
        </Pressable>
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
          <NativeImage
            source={require('../../assets/images/image-error.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )
      ) : !!state.source ? (
        <NativeImage
          key={String(state.modificationTime)}
          source={state.source}
          style={style}
          {...props}
        />
      ) : !!children ? (
        renderNode(children?.type, children?.props)
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
            <ButtonIcon
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
    margin: 4,
  },
  rounded: {
    borderRadius: 16,
  },
  circle: {
    borderRadius: 250,
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
