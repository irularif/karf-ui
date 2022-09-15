import { cloneDeep } from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
} from 'react-native';
import { ButtonIcon, ButtonIconProps } from '../../Button/Icon';
import type { RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';
import type { ITheme } from '../../ThemeProvider/context';

type TextState = {
  tempValue: string;
  value: string;
  valueType: string;
  type: TInputType;
  secure: boolean;
  isFocus: boolean;
};

interface InputMiscProps extends TextInputProps {
  inputState: [TextState, React.Dispatch<React.SetStateAction<TextState>>];
  theme?: ITheme;
}

export type TInputType =
  | 'text'
  | 'number'
  | 'password'
  | 'decimal'
  | 'multiline'
  | 'currency'
  | 'email'
  | 'url';

export type TextInputMethods = {
  getState: () => TextState;
  toggleSecure: Function;
} & NativeTextInput;

export interface TextInputProps extends Omit<NativeTextInputProps, 'onChangeText' | 'onChange'> {
  type?: TInputType;
  masiking?: {
    [Symbol.replace](string: string, replaceValue: string): string;
  };
  sperator?: Partial<{
    decimal: string;
    thousand: string;
  }>;
  secureProps?: Partial<ButtonIconProps>;
  clearButtonProps?: Partial<ButtonIconProps>;
  onChange?: (e: TextState) => void;
  onChangeValue?: (value: string) => void;
}

const _TextInput: RNFunctionComponent<TextInputProps> = forwardRef(
  (
    {
      children,
      style,
      value = '',
      type = 'text',
      masiking,
      sperator,
      theme,
      secureProps,
      clearButtonMode,
      placeholderTextColor = theme?.colors.grey400,
      onChange: _onChange,
      onChangeValue,
      onFocus: _onFocus,
      onBlur: _onBlur,
      ...props
    },
    ref: React.ForwardedRef<TextInputMethods>
  ) => {
    const innerRef = useRef<NativeTextInput>(null);
    const inputState = useState<TextState>({
      tempValue: '',
      value: '',
      valueType: 'string',
      type: type,
      secure: type === 'password' ? true : false,
      isFocus: false,
    });
    const [state, setState] = inputState;

    const parseValue = useCallback(
      (value: string = '') => {
        let _value = String(value);
        switch (type) {
          case 'number':
            _value = _value.replace(/\d/g, '');
            break;
          case 'decimal':
            _value = _value.replace(/(-\d*\.?\d+).*|[^0-9.]/g, '');
            break;
          case 'currency':
            _value = _value.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, `$1,`);
            break;
          case 'email':
            _value = _value.replace(/[^a-zA-Z0-9@.!#$%&'*+\/=?^_`{|}~-]/g, '');
            break;
          case 'url':
            _value = _value.replace(/\s/g, '');
            break;
        }

        return _value;
      },
      [type, sperator]
    );

    const deparseValue = useCallback(
      (value: string = '') => {
        let _value: any = String(value);
        switch (type) {
          case 'currency':
            _value = _value.replace(/[^0-9.-]+/g, '');
            break;
        }
        return _value || '';
      },
      [type, sperator]
    );

    const parseToOriginalValue = useCallback(
      (value: string = '') => {
        let _value: any = String(value);
        switch (type) {
          case 'currency':
          case 'number':
          case 'decimal':
            _value = Number(_value);
            break;
        }
        return _value || '';
      },
      [type, sperator]
    );

    const onChange = useCallback(
      (e: any) => {
        let _value = deparseValue(e.nativeEvent.text);
        let _originalValue = parseToOriginalValue(_value);
        _value = parseValue(_value);
        innerRef.current?.setNativeProps({ text: _value });
        setState((prevState) => ({
          ...prevState,
          tempValue: _value,
          value: _originalValue,
        }));
        if (_onChange) {
          // onChange(Object.assign({}, e, { nativeEvent: { text: _originalValue } }));
          _onChange(cloneDeep(state));
        }
        if (onChangeValue) {
          onChangeValue(_originalValue);
        }
      },
      [state]
    );

    const onFocus = useCallback(
      (e: any) => {
        setState((prev) => ({
          ...prev,
          isFocus: true,
        }));
        if (_onFocus) {
          _onFocus(e);
        }
      },
      [_onFocus]
    );

    const onBlur = useCallback(
      (e: any) => {
        setState((prev) => ({
          ...prev,
          isFocus: false,
        }));
        if (_onBlur) {
          _onBlur(e);
        }
      },
      [_onBlur]
    );

    const keyboardType = useMemo((): KeyboardTypeOptions => {
      switch (type) {
        case 'number':
          return 'number-pad';
        case 'decimal':
          return 'decimal-pad';
        case 'currency':
          return 'numeric';
        case 'email':
          return 'email-address';
        case 'url':
          return 'url';
        default:
          return 'default';
      }
    }, [type]);

    useImperativeHandle(
      ref,
      () =>
        Object.assign(innerRef.current as NativeTextInput, {
          getState: () => cloneDeep(state),
        }) as TextInputMethods,
      [state, innerRef.current]
    );

    useEffect(() => {
      setState((prev) => {
        if (value !== prev.value) {
          return {
            ...prev,
            tempValue: parseValue(value),
            valueType: typeof value,
            value,
            type,
          };
        }
        return state;
      });
    }, [value, type]);

    const finalStyle = StyleSheet.flatten([
      styles.basic,
      {
        color: theme?.colors.black,
      },
      type === 'multiline' && {
        minHeight: 80,
      },
      style,
    ]);

    return (
      <>
        <NativeTextInput
          textAlignVertical={type === 'multiline' ? 'top' : 'center'}
          {...props}
          multiline={type === 'multiline'}
          numberOfLines={type === 'multiline' ? 4 : undefined}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={state.tempValue}
          secureTextEntry={state.secure}
          style={finalStyle}
          ref={innerRef}
          keyboardType={keyboardType}
          placeholderTextColor={placeholderTextColor}
        />
        <RenderClearInput theme={theme} inputState={inputState} clearButtonMode={clearButtonMode} />
        <RenderTogglePassword
          type={type}
          theme={theme}
          inputState={inputState}
          secureProps={secureProps}
        />
      </>
    );
  }
);

const RenderTogglePassword = ({ type, inputState, secureProps, theme }: InputMiscProps) => {
  const [state, setState] = inputState;

  const toggleSecure = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      secure: !prevState.secure,
    }));
  }, []);

  const finalContainerButtonStyle = StyleSheet.flatten([
    styles.buttonContainer,
    secureProps?.containerStyle,
  ]);
  const finalStyleButtonStyle = StyleSheet.flatten([styles.button, secureProps?.style]);

  if (type == 'password') {
    return (
      <ButtonIcon
        name={state.secure ? 'eye-off' : 'eye'}
        color={theme?.colors.grey400}
        {...secureProps}
        onPress={toggleSecure}
        containerStyle={finalContainerButtonStyle}
        style={finalStyleButtonStyle}
      />
    );
  }

  return null;
};
const RenderClearInput = ({
  inputState,
  clearButtonMode,
  theme,
  clearButtonProps,
}: InputMiscProps) => {
  const [state, setState] = inputState;

  const clearInput = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      tempValue: '',
    }));
  }, []);

  const finalContainerButtonStyle = StyleSheet.flatten([
    styles.buttonContainer,
    clearButtonProps?.containerStyle,
  ]);
  const finalStyleButtonStyle = StyleSheet.flatten([styles.button, clearButtonProps?.style]);

  const visible = useMemo(() => {
    let _visible = false;
    if (
      clearButtonMode === 'always' ||
      (clearButtonMode === 'while-editing' && state.isFocus) ||
      (clearButtonMode === 'unless-editing' && !state.isFocus)
    ) {
      _visible = true;
    }
    return _visible;
  }, [state]);

  if (visible) {
    return (
      <ButtonIcon
        name="close-circle"
        color={theme?.colors.grey400}
        {...clearButtonProps}
        onPress={clearInput}
        containerStyle={finalContainerButtonStyle}
        style={finalStyleButtonStyle}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  basic: {
    paddingHorizontal: 4,
    flex: 1,
    minHeight: 32,
    minWidth: 20,
  },
  buttonContainer: {
    margin: 0,
  },
  button: {
    padding: 4,
  },
});

_TextInput.displayName = 'Input.Text';
export const TextInput = withConfig(_TextInput);
