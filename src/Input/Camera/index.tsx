import Color from 'color';
import { Camera, CameraType, PermissionStatus } from 'expo-camera';
import { cloneDeep, get } from 'lodash';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Appbar } from '../../Appbar';
import { Button, ButtonProps } from '../../Button';
import type { RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';
import { Modal } from '../../Modal';
import { Text } from '../../Text';
import type { ITheme } from '../../ThemeProvider/context';
import { View } from '../../View';

const { width } = Dimensions.get('screen');

type CameraState = {
  tempValue: string;
  value: string;
  visible: boolean;
  type: CameraType;
  ratio: '1:1' | '4:3' | '16:9';
};

export type CameraInputMethod = {
  getState: () => Partial<CameraState>;
  focus: () => void;
};
export interface CameraInputProps extends ButtonProps {
  value?: string;
}

const _CameraInput: RNFunctionComponent<CameraInputProps> = forwardRef(
  ({ children, value, style, theme, onLayout, onFocus, onBlur, ...props }, ref) => {
    const cameraState = useState<CameraState>({
      tempValue: '',
      value: '-',
      visible: false,
      type: CameraType.back,
      ratio: '4:3',
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
      if (value) {
        setState((state) => ({
          ...state,
          tempValue: '',
          value: value,
        }));
      }
    }, [value]);

    const finalButtonStyle = StyleSheet.flatten([
      styles.button,
      {
        backgroundColor: get(style, 'backgroundColor', theme?.colors.grey500),
      },
      style,
    ]);
    const finalContainerButtonStyle = StyleSheet.flatten([styles.containerButton]);
    const finalLabelButtonStyle = StyleSheet.flatten([
      styles.label,
      {
        color: theme?.colors.black,
      },
    ]);
    const finalModalStyle = StyleSheet.flatten([styles.modal]);

    return (
      <>
        <Button
          {...props}
          variant="text"
          style={finalButtonStyle}
          containerStyle={finalContainerButtonStyle}
          onPress={toggleModal}
          containerProps={{ onLayout }}
        >
          {!!children ? (
            children
          ) : (
            <>
              <Button.LeftIcon name="camera" color={theme?.colors.grey500} size={36} />
              <Button.Label style={finalLabelButtonStyle}>Press to open camera</Button.Label>
            </>
          )}
        </Button>
        <Modal
          position="full"
          isOpen={state.visible}
          contentContainerStyle={finalModalStyle}
          statusBar={{
            barStyle: 'light-content',
          }}
        >
          <RenderCamera cameraState={cameraState} toggleModal={toggleModal} theme={theme} />
        </Modal>
      </>
    );
  }
);

interface RenderCameraProps {
  cameraState: [CameraState, React.Dispatch<React.SetStateAction<CameraState>>];
  toggleModal: (e: any) => void;
  theme?: ITheme;
}

const RenderCamera = ({ cameraState, toggleModal, theme }: RenderCameraProps) => {
  const [permissions, requestPermission] = Camera.useCameraPermissions();
  const [state, setState] = cameraState;

  const switchCameraType = useCallback(() => {
    setState((state) => ({
      ...state,
      type: state.type === CameraType.back ? CameraType.front : CameraType.back,
    }));
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

  const request = useCallback(() => {
    if (!permissions) {
      requestPermission();
    } else if (permissions.status !== PermissionStatus.GRANTED && permissions.canAskAgain) {
      requestPermission();
    }
  }, [permissions]);

  const finalTopToolbarStyle = StyleSheet.flatten([styles.toolbarTop]);
  const finalBottomToolbarStyle = StyleSheet.flatten([styles.toolbarBottom]);
  const finalToolbarButtonStyle = StyleSheet.flatten([styles.toolbarButton]);
  const finalButtonSnapStyle = StyleSheet.flatten([styles.buttonSnap]);
  const finalContainerButtonSnapStyle = StyleSheet.flatten([styles.containerButtonSnap]);
  const ratio = state.ratio.split(':');
  const finalCameraViewStyle = StyleSheet.flatten([
    styles.cameraView,
    {
      width: width,
      height: width * (Number(ratio[0]) / Number(ratio[1])),
    },
  ]);

  if (!!permissions && permissions.status === PermissionStatus.GRANTED) {
    return (
      <>
        <Appbar
          insetTop
          style={finalTopToolbarStyle}
          disableShadow
          backgroundColor={Color(theme?.colors.black).alpha(0.5).rgb().toString()}
          containerStyle={styles.toolbarTopContainer}
        >
          <Button variant="text" style={finalToolbarButtonStyle} rounded onPress={switchRatio}>
            <Button.Label>[{state.ratio}]</Button.Label>
            <Button.Label>Ratio</Button.Label>
          </Button>
          <Button variant="text" style={finalToolbarButtonStyle} rounded>
            <Button.LeftIcon name="flash" color={theme?.colors.white} />
            <Button.Label>Flash</Button.Label>
          </Button>
          <Button onPress={toggleModal} variant="text" style={finalToolbarButtonStyle} rounded>
            <Button.LeftIcon name="close" color={theme?.colors.white} />
            <Button.Label>Cancel</Button.Label>
          </Button>
        </Appbar>
        <View style={styles.modalContent}>
          <Camera style={finalCameraViewStyle} type={state.type} ratio={state.ratio} />
        </View>
        <Appbar
          insetBottom
          style={finalBottomToolbarStyle}
          disableShadow
          backgroundColor={Color(theme?.colors.black).alpha(0.5).rgb().toString()}
          containerStyle={styles.toolbarBottomContainer}
        >
          <Button variant="text" style={finalToolbarButtonStyle} rounded>
            <Button.LeftIcon name="images" color={theme?.colors.white} size={32} />
          </Button>
          <Button
            style={finalButtonSnapStyle}
            containerStyle={finalContainerButtonSnapStyle}
            rounded
          >
            <Button.LeftIcon type="material" name="camera" color={theme?.colors.black} size={40} />
          </Button>
          <Button variant="text" style={finalToolbarButtonStyle} rounded onPress={switchCameraType}>
            <Button.LeftIcon name="camera-reverse" color={theme?.colors.white} size={36} />
          </Button>
        </Appbar>
      </>
    );
  }

  return (
    <View style={styles.permission}>
      <Text style={styles.text} heading="h4">
        Camera
      </Text>
      <Text style={styles.text}>Enable access so you can start taking photos.</Text>
      <Button variant="text" onPress={request}>
        <Button.Label style={styles.labelButton}>Request Permission</Button.Label>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerButton: {
    flexGrow: 1,
    margin: 0,
    borderRadius: 0,
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
  },
  scrollView: {
    padding: 20,
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
    borderRadius: 999,
  },
  containerButtonSnap: {
    marginHorizontal: 30,
  },
  cameraView: {
    backgroundColor: 'red',
  },
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
});

_CameraInput.displayName = 'Input.Camera';
export const CameraInput = withConfig(_CameraInput);
