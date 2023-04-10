import Color from 'color';
import {
  Camera,
  CameraPictureOptions,
  CameraProps,
  CameraType,
  FlashMode,
  PermissionStatus,
} from 'expo-camera';
import { ImageType, PermissionResponse } from 'expo-camera/build/Camera.types';
import { cloneDeep, get } from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Dimensions, ImageStyle, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Appbar } from '../../Appbar';
import { Button, ButtonProps } from '../../Button';
import type { RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';
import { Image } from '../../Image';
import { Modal } from '../../Modal';
import { Text } from '../../Text';
import type { ITheme } from '../../ThemeProvider/context';
import { View } from '../../View';
import { ImagePicker, ImageState } from '../ImagePicker';

const { width } = Dimensions.get('screen');

export type CameraState = {
  tempValue: string;
  width: number;
  height: number;
  value: string;
  visible: boolean;
  type: CameraType;
  ratio: '1:1' | '4:3' | '16:9' | string;
  flashMode: Exclude<FlashMode, FlashMode.torch>;
};

export type CameraInputMethod = {
  getState: () => Partial<CameraState>;
  focus: () => void;
};
export interface CameraInputProps extends ButtonProps {
  value?: string;
  cameraProps?: Partial<CameraProps>;
  cameraOptions?: Partial<CameraPictureOptions>;
  onChange?: (e: CameraState) => void;
  onChangeValue?: (value: string) => void;
  disablePreview?: boolean;
  disableImagePicker?: boolean;
}

const _CameraInput: RNFunctionComponent<CameraInputProps> = forwardRef(
  (
    {
      children,
      value = '',
      style,
      theme,
      containerStyle,
      disablePreview = false,
      disableImagePicker = false,
      onLayout,
      onFocus,
      onBlur,
      onChange,
      onChangeValue,
      cameraProps = {},
      cameraOptions = {
        quality: 0.5,
        imageType: ImageType.jpg,
        skipProcessing: false,
      },
      ...props
    },
    ref
  ) => {
    const {
      type = CameraType.back,
      ratio = '4:3',
      flashMode = FlashMode.auto,
      ..._cameraProps
    } = cameraProps;
    const cameraState = useState<CameraState>({
      tempValue: '',
      width: 0,
      height: 0,
      value: '',
      visible: false,
      type: type as CameraState['type'],
      ratio: ratio,
      flashMode: flashMode as CameraState['flashMode'],
    });

    const [state, setState] = cameraState;

    const toggleModal = useCallback(
      (e: any) => {
        setState((state) => ({ ...state, visible: !state.visible }));
        setTimeout(() => {
          if (!state.visible) {
            if (!!onFocus) {
              onFocus(e);
            }
          }
          if (!!state.visible) {
            if (!!onBlur) {
              onBlur(e);
            }
          }
        }, 0);
      },
      [state, onFocus, onBlur]
    );

    useImperativeHandle(
      ref,
      () =>
        Object.assign({
          getState: () => cloneDeep(state),
          focus: () => {
            toggleModal(state);
          },
        }) as CameraInputMethod,
      [state]
    );

    useEffect(() => {
      setState((state) => {
        if (value !== state.value) {
          if (value.startsWith('http') || value.startsWith('file')) {
            const { width, height } = Image.resolveAssetSource({ uri: value });
            return {
              ...state,
              width: width,
              height: height,
              tempValue: value,
              value: value,
            };
          }
        } else if (!value) {
          return {
            ...state,
            width: 0,
            height: 0,
            tempValue: '',
            value: '',
          };
        }
        return state;
      });
    }, [value]);

    const finalButtonStyle = StyleSheet.flatten([
      styles.button,
      {
        backgroundColor: get(style, 'backgroundColor', theme?.colors.white),
      },
      style,
    ]);
    const finalContainerButtonStyle = StyleSheet.flatten([styles.containerButton, containerStyle]);
    const finalLabelButtonStyle = StyleSheet.flatten([
      styles.label,
      {
        color: theme?.colors.black,
      },
    ]);
    const finalModalStyle = StyleSheet.flatten([styles.modal]);
    const finalImageStyle = StyleSheet.flatten([
      styles.image,
      {
        backgroundColor: theme?.colors.background,
      },
    ]);

    return (
      <>
        <Button
          {...props}
          style={finalButtonStyle}
          containerStyle={finalContainerButtonStyle}
          onPress={toggleModal}
          containerProps={{ onLayout }}
        >
          <RenderButtonPreview
            cameraState={cameraState}
            style={finalImageStyle}
            theme={theme}
            disablePreview={disablePreview}
            finalLabelButtonStyle={finalLabelButtonStyle}
            children={children}
          />
        </Button>
        <Modal
          position="full"
          isOpen={state.visible}
          contentContainerStyle={finalModalStyle}
          statusBar={{
            barStyle: 'light-content',
          }}
        >
          <RenderView
            cameraState={cameraState}
            theme={theme}
            toggleModal={toggleModal}
            cameraOptions={cameraOptions}
            onChange={onChange}
            onChangeValue={onChangeValue}
            cameraProps={_cameraProps}
            disableImagePicker={disableImagePicker}
          />
        </Modal>
      </>
    );
  }
);

interface IRenderView {
  cameraState: [CameraState, React.Dispatch<React.SetStateAction<CameraState>>];
  toggleModal: (e: any) => void;
  theme?: ITheme;
  cameraOptions: Partial<CameraPictureOptions>;
  onChange: ((e: CameraState) => void) | undefined;
  onChangeValue: ((value: string) => void) | undefined;
  cameraProps: CameraProps | undefined;
  disableImagePicker: boolean;
}

const RenderView = ({
  cameraState,
  toggleModal,
  theme,
  onChange,
  onChangeValue,
  cameraOptions,
  cameraProps,
  disableImagePicker,
}: IRenderView) => {
  const [state] = cameraState;
  const permissionsState = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);

  if (state.tempValue) {
    return (
      <RenderPreview
        cameraState={cameraState}
        toggleModal={toggleModal}
        theme={theme}
        onChange={onChange}
        onChangeValue={onChangeValue}
      />
    );
  }
  return (
    <RenderCamera
      cameraState={cameraState}
      toggleModal={toggleModal}
      theme={theme}
      cameraRef={cameraRef}
      cameraProps={cameraProps}
      cameraOptions={cameraOptions}
      permissionsState={permissionsState}
      disableImagePicker={disableImagePicker}
    />
  );
};

interface IRenderButtonPreview {
  cameraState: [CameraState, React.Dispatch<React.SetStateAction<CameraState>>];
  disablePreview: boolean;
  finalLabelButtonStyle: StyleProp<TextStyle>;
  theme?: ITheme;
  style: StyleProp<ImageStyle>;
  children: React.ReactNode;
}

const RenderButtonPreview = ({
  cameraState,
  disablePreview,
  style,
  children,
  theme,
  finalLabelButtonStyle,
}: IRenderButtonPreview) => {
  const [state] = cameraState;
  return (
    <>
      {!!state.value && !disablePreview ? (
        <Image source={{ uri: state.value }} style={style} />
      ) : !!children ? (
        children
      ) : (
        <>
          <Button.LeftIcon name="camera" color={theme?.colors.grey500} size={36} />
          <Button.Label style={finalLabelButtonStyle}>Press to open camera</Button.Label>
        </>
      )}
    </>
  );
};

interface RenderCameraProps {
  cameraState: [CameraState, React.Dispatch<React.SetStateAction<CameraState>>];
  permissionsState: [
    PermissionResponse | null,
    () => Promise<PermissionResponse>,
    () => Promise<PermissionResponse>
  ];
  toggleModal: (e: any) => void;
  theme?: ITheme;
  cameraRef: React.RefObject<Camera>;
  cameraProps?: CameraProps;
  cameraOptions?: CameraPictureOptions;
  disableImagePicker: boolean;
}

const RenderCamera = ({
  cameraState,
  toggleModal,
  theme,
  cameraRef,
  cameraOptions,
  permissionsState,
  disableImagePicker,
}: RenderCameraProps) => {
  const [state, setState] = cameraState;
  const [permissions, requestPermission] = permissionsState;

  const request = useCallback(() => {
    if (!permissions) {
      requestPermission();
    } else if (permissions.status !== PermissionStatus.GRANTED && permissions.canAskAgain) {
      requestPermission();
    }
  }, [permissions]);

  const ratio = state.ratio.split(':');
  const finalCameraViewStyle = StyleSheet.flatten([
    styles.cameraView,
    {
      width: width,
      height: width * (Number(ratio[0]) / Number(ratio[1])),
    },
  ]);
  const finalToolbarButtonStyle = StyleSheet.flatten([styles.toolbarButton]);
  const finalTopToolbarStyle: ViewStyle = StyleSheet.flatten([
    styles.toolbarTop,
    { justifyContent: 'flex-end' },
  ]);

  const cancel = useCallback((e: any) => {
    toggleModal(e);
    setState((prev) => ({ ...prev, tempValue: prev.value }));
  }, []);

  if (!permissions || permissions.status !== PermissionStatus.GRANTED) {
    return (
      <>
        <Appbar
          insetTop
          style={finalTopToolbarStyle}
          disableShadow
          backgroundColor={Color(theme?.colors.black).alpha(0).rgb().toString()}
          containerStyle={styles.toolbarTopContainer}
        >
          <Button onPress={cancel} variant="text" style={finalToolbarButtonStyle} rounded>
            <Button.LeftIcon name="close" color={theme?.colors.white} />
            <Button.Label>Cancel</Button.Label>
          </Button>
        </Appbar>
        <View style={styles.permission}>
          <Text style={styles.text} heading="h4">
            Camera
          </Text>
          <Text style={styles.text}>Enable access so you can start taking photos.</Text>
          <Button variant="text" onPress={request}>
            <Button.Label style={styles.labelButton}>Request Permission</Button.Label>
          </Button>
        </View>
      </>
    );
  }

  return (
    <>
      <ActionTop toggleModal={toggleModal} cameraState={cameraState} theme={theme} />
      <View style={styles.modalContent}>
        <Camera
          ref={cameraRef}
          type={state.type}
          ratio={state.ratio}
          flashMode={state.flashMode}
          style={finalCameraViewStyle}
        />
      </View>
      <ActionBottom
        cameraState={cameraState}
        theme={theme}
        cameraRef={cameraRef}
        cameraOptions={cameraOptions}
        disableImagePicker={disableImagePicker}
      />
    </>
  );
};

interface IActionTop {
  theme?: ITheme;
  cameraState: [CameraState, React.Dispatch<React.SetStateAction<CameraState>>];
  toggleModal: Function;
}

const ActionTop = ({ cameraState, toggleModal, theme }: IActionTop) => {
  const finalTopToolbarStyle = StyleSheet.flatten([styles.toolbarTop]);
  const [state, setState] = cameraState;

  const cancel = useCallback((e: any) => {
    toggleModal(e);
    setState((prev) => ({ ...prev, tempValue: prev.value }));
  }, []);

  const switchRatio = useCallback(() => {
    setState((state) => ({
      ...state,
      ratio: {
        '1:1': '4:3',
        '4:3': '16:9',
        '16:9': '1:1',
      }[state.ratio] as CameraState['ratio'],
    }));
  }, [state]);

  const switchFlash = useCallback(() => {
    setState((state) => ({
      ...state,
      flashMode: {
        auto: FlashMode.on,
        on: FlashMode.off,
        off: FlashMode.auto,
      }[state.flashMode] as CameraState['flashMode'],
    }));
  }, []);
  const finalToolbarButtonStyle = StyleSheet.flatten([styles.toolbarButton]);

  return (
    <Appbar
      insetTop
      style={finalTopToolbarStyle}
      disableShadow
      backgroundColor={Color(theme?.colors.black).alpha(0.5).rgb().toString()}
      containerStyle={styles.toolbarTopContainer}
    >
      <View style={styles.toolbarTopWrap}>
        <Button variant="text" style={finalToolbarButtonStyle} rounded onPress={switchRatio}>
          <Button.Label>[{state.ratio}]</Button.Label>
          <Button.Label>Ratio</Button.Label>
        </Button>
      </View>
      <View style={styles.toolbarTopWrap}>
        <Button variant="text" style={finalToolbarButtonStyle} rounded onPress={switchFlash}>
          {state.flashMode !== 'auto' && (
            <Button.LeftIcon
              name={
                {
                  on: 'flash',
                  off: 'flash-off',
                  auto: 'flash-auto',
                }[state.flashMode]
              }
              color={theme?.colors.white}
            />
          )}
          <Button.Label style={{ textTransform: 'capitalize' }}>{state.flashMode}</Button.Label>
        </Button>
      </View>
      <View style={styles.toolbarTopWrap}>
        <Button onPress={cancel} variant="text" style={finalToolbarButtonStyle} rounded>
          <Button.LeftIcon name="close" color={theme?.colors.white} />
          <Button.Label>Cancel</Button.Label>
        </Button>
      </View>
    </Appbar>
  );
};

interface IActionBottom {
  theme?: ITheme;
  cameraState: [CameraState, React.Dispatch<React.SetStateAction<CameraState>>];
  cameraRef: React.RefObject<Camera>;
  cameraOptions: CameraPictureOptions | undefined;
  disableImagePicker: boolean;
}

const ActionBottom = ({
  cameraState,
  cameraRef,
  cameraOptions,
  theme,
  disableImagePicker,
}: IActionBottom) => {
  const [_, setState] = cameraState;

  const switchCameraType = useCallback(() => {
    setState((state) => ({
      ...state,
      type: state.type === CameraType.back ? CameraType.front : CameraType.back,
    }));
  }, []);

  const snapPicture = useCallback(async () => {
    if (!!cameraRef?.current) {
      cameraRef.current
        .takePictureAsync(cameraOptions)
        .then((res) => {
          if (!!res.uri) {
            setState((state) => ({
              ...state,
              tempValue: res.uri,
              height: res.height,
              width: res.width,
            }));
          }
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }, [cameraRef.current]);

  const imagePicker = useCallback((image: ImageState) => {
    if (!!image.value) {
      setState((prev) => ({
        ...prev,
        tempValue: image.value,
        height: image.height,
        width: image.width,
      }));
    }
  }, []);

  const finalToolbarButtonStyle = StyleSheet.flatten([styles.toolbarButton]);
  const finalBottomToolbarStyle = StyleSheet.flatten([styles.toolbarBottom]);
  const finalPickerButtonStyle = StyleSheet.flatten([
    finalToolbarButtonStyle,
    {
      height: undefined,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
  ]);
  const finalContainerPickerButtonStyle = StyleSheet.flatten([
    {
      flex: 0,
    },
  ]);
  const finalButtonSnapStyle = StyleSheet.flatten([styles.buttonSnap]);
  const finalContainerButtonSnapStyle = StyleSheet.flatten([styles.containerButtonSnap]);

  return (
    <Appbar
      insetBottom
      style={finalBottomToolbarStyle}
      disableShadow
      backgroundColor={Color(theme?.colors.black).alpha(0.5).rgb().toString()}
      containerStyle={styles.toolbarBottomContainer}
    >
      <ImagePicker
        variant="text"
        style={finalPickerButtonStyle}
        containerStyle={finalContainerPickerButtonStyle}
        rounded
        onChange={imagePicker}
        disablePreview
        disabled={disableImagePicker}
      >
        <Button.LeftIcon name="images" color={theme?.colors.white} size={32} />
      </ImagePicker>
      <Button
        style={finalButtonSnapStyle}
        containerStyle={finalContainerButtonSnapStyle}
        rounded
        onPress={snapPicture}
      >
        <Button.LeftIcon type="material" name="camera" color={theme?.colors.black} size={40} />
      </Button>
      <Button variant="text" style={finalToolbarButtonStyle} rounded onPress={switchCameraType}>
        <Button.LeftIcon name="camera-reverse" color={theme?.colors.white} size={36} />
      </Button>
    </Appbar>
  );
};

interface RenderPreviewProps {
  cameraState: [CameraState, React.Dispatch<React.SetStateAction<CameraState>>];
  theme?: ITheme;
  toggleModal: (e: any) => void;
  onChange?: (e: CameraState) => void;
  onChangeValue?: (value: string) => void;
}

const RenderPreview = ({
  cameraState,
  toggleModal,
  theme,
  onChange,
  onChangeValue,
}: RenderPreviewProps) => {
  const { width } = Dimensions.get('window');
  const [state, setState] = cameraState;

  const submit = useCallback(
    (e: any) => {
      toggleModal(e);
      if (state.value !== state.tempValue) {
        setState((prev) => ({ ...prev, value: prev.tempValue }));
      }
      if (!!onChange) {
        onChange(cloneDeep(state));
      }
      if (!!onChangeValue) {
        onChangeValue(state.value);
      }
    },
    [state]
  );

  const takePicture = useCallback(() => {
    setState((prev) => ({ ...prev, tempValue: '' }));
  }, []);

  const imagePicker = useCallback((image: ImageState) => {
    if (!!image.value) {
      setState((prev) => ({
        ...prev,
        tempValue: image.value,
        height: image.height,
        width: image.width,
      }));
    }
  }, []);

  const finalBottomToolbarStyle = StyleSheet.flatten([styles.toolbarBottom]);
  const finalToolbarButtonStyle = StyleSheet.flatten([styles.toolbarButton]);
  const finalButtonSnapStyle = StyleSheet.flatten([styles.buttonSnap]);
  const finalContainerButtonSnapStyle = StyleSheet.flatten([styles.containerButtonSnap]);
  const finalImageStyle = StyleSheet.flatten([styles.image]);
  const finalPickerButtonStyle = StyleSheet.flatten([
    finalToolbarButtonStyle,
    {
      height: undefined,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
  ]);
  const finalContainerPickerButtonStyle = StyleSheet.flatten([
    {
      flex: 0,
    },
  ]);

  return (
    <>
      <View style={styles.modalContent}>
        <Image.Zoom imageWidth={width} imageHeight={(width * state.height) / state.width}>
          <Image source={{ uri: state.tempValue }} style={finalImageStyle} />
        </Image.Zoom>
      </View>
      <Appbar
        insetBottom
        style={finalBottomToolbarStyle}
        disableShadow
        backgroundColor={Color(theme?.colors.black).alpha(0.5).rgb().toString()}
        containerStyle={styles.toolbarBottomContainer}
      >
        <ImagePicker
          variant="text"
          style={finalPickerButtonStyle}
          containerStyle={finalContainerPickerButtonStyle}
          rounded
          onChange={imagePicker}
          disablePreview
        >
          <Button.LeftIcon name="images" color={theme?.colors.white} size={32} />
        </ImagePicker>
        <Button
          style={finalButtonSnapStyle}
          containerStyle={finalContainerButtonSnapStyle}
          rounded
          onPress={submit}
        >
          <Button.LeftIcon name="checkmark" color={theme?.colors.black} size={40} />
        </Button>
        <Button variant="text" style={finalToolbarButtonStyle} rounded onPress={takePicture}>
          <Button.LeftIcon name="reload" color={theme?.colors.white} size={36} />
        </Button>
      </Appbar>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 120,
  },
  containerButton: {
    flex: 1,
    marginVertical: 8,
  },
  modal: {
    backgroundColor: '#000',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  label: {
    textAlign: 'left',
    marginLeft: 0,
    fontWeight: '400',
    flexGrow: 0,
    flexShrink: 0,
  },
  scrollView: {
    padding: 20,
  },
  toolbarTopWrap: {
    flex: 1,
    alignItems: 'center',
  },
  toolbarTopContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  toolbarBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  toolbarTop: {
    justifyContent: 'space-between',
  },
  toolbarBottom: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  toolbarButton: {
    backgroundColor: '#fff',
  },
  buttonSnap: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 250,
  },
  containerButtonSnap: {
    marginHorizontal: 30,
  },
  cameraView: {},
  permission: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    marginBottom: 8,
  },
  labelButton: {
    textDecorationLine: 'underline',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

_CameraInput.displayName = 'Input.Camera';
export const CameraInput = withConfig(_CameraInput);
