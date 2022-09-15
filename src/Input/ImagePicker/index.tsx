import * as NativeImagePicker from 'expo-image-picker';
import { cloneDeep, get } from 'lodash';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from '../../Button';
import type { RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';
import { Image } from '../../Image';

export interface ImageState {
  tempValue: string;
  value: string;
  width: number;
  height: number;
}

export type ImagePickerInputMethod = {
  getState: () => Partial<ImageState>;
  focus: () => void;
};

export interface ImagePickerProps extends ButtonProps {
  value?: string;
  onChange?: (e: ImageState) => void;
  onChangeValue?: (value: string) => void;
  imagePickerOptions?: NativeImagePicker.ImagePickerOptions;
  disablePreview?: boolean;
}

const _ImagePicker: RNFunctionComponent<ImagePickerProps> = forwardRef(
  (
    {
      value = '',
      theme,
      style,
      containerStyle,
      children,
      disablePreview = false,
      onLayout,
      onChange,
      onChangeValue,
      onFocus,
      onBlur,
      imagePickerOptions = {
        mediaTypes: NativeImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.5,
      },
      ...props
    },
    ref
  ) => {
    const imageState = useState<ImageState>({
      tempValue: '',
      value: '',
      width: 0,
      height: 0,
    });
    const [state, setState] = imageState;

    const pickImage = useCallback(
      (e: any) => {
        if (!!onFocus) {
          onFocus(e);
        }
        NativeImagePicker.launchImageLibraryAsync()
          .then((res) => {
            if (!res.cancelled) {
              setState((prev) => ({
                ...prev,
                tempValue: res.uri,
                value: res.uri,
                width: res.width,
                height: res.height,
              }));
              if (onChange) {
                onChange({
                  tempValue: res.uri,
                  value: res.uri,
                  width: res.width,
                  height: res.height,
                });
              }
              if (onChangeValue) {
                onChangeValue(res.uri);
              }
            }
          })
          .catch((err) => {
            console.warn(err);
          })
          .finally(() => {
            if (!!onBlur) {
              onBlur(e);
            }
          });
      },
      [state]
    );

    useImperativeHandle(
      ref,
      () =>
        Object.assign({
          getState: () => cloneDeep(state),
          focus: () => {
            pickImage(state);
          },
        }) as ImagePickerInputMethod,
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
    const finalImageStyle = StyleSheet.flatten([
      styles.image,
      {
        backgroundColor: theme?.colors.background,
      },
    ]);

    return (
      <Button
        {...props}
        style={finalButtonStyle}
        containerStyle={finalContainerButtonStyle}
        onPress={pickImage}
        containerProps={{ onLayout }}
      >
        {!!state.value && !disablePreview ? (
          <Image source={{ uri: state.value }} style={finalImageStyle} />
        ) : !!children ? (
          children
        ) : (
          <>
            <Button.LeftIcon name="image" color={theme?.colors.grey500} size={36} />
            <Button.Label style={finalLabelButtonStyle}>Press to pick image</Button.Label>
          </>
        )}
      </Button>
    );
  }
);

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
  label: {
    textAlign: 'left',
    marginLeft: 0,
    fontWeight: '400',
    flexGrow: 0,
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

_ImagePicker.displayName = 'Input.ImagePicker';
export const ImagePicker = withConfig(_ImagePicker);
