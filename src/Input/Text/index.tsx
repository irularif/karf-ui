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
  getState: () => {
    value: string;
    tempValue: string;
    valueType: string;
    type: TInputType;
    secure: boolean;
  };
  toggleSecure: Function;
} & NativeTextInput;

export interface TextInputProps extends Omit<NativeTextInputProps, 'onChangeText'> {
  type?: TInputType;
  masiking?: {
    [Symbol.replace](string: string, replaceValue: string): string;
  };
  sperator?: Partial<{
    decimal: string;
    thousand: string;
  }>;
  secureProps?: Partial<ButtonIconProps>;
  onChangeValue?: (value: string) => void;
}

const _TextInput: RNFunctionComponent<TextInputProps> = forwardRef(
  (
    {
      children,
      style,
      value,
      type = 'text',
      masiking,
      sperator,
      theme,
      secureProps,
      onChange,
      onChangeValue,
      ...props
    },
    ref: React.ForwardedRef<TextInputMethods>
  ) => {
    const innerRef = useRef<NativeTextInput>(null);
    const [state, setState] = useState({
      tempValue: '',
      value: '',
      valueType: 'string',
      type: type,
      secure: type === 'password' ? true : false,
    });

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

    const _onChange = useCallback((e: any) => {
      let _value = deparseValue(e.nativeEvent.text);
      let _originalValue = parseToOriginalValue(_value);
      _value = parseValue(_value);
      innerRef.current?.setNativeProps({ text: _value });
      setState((prevState) => ({
        ...prevState,
        tempValue: _value,
        value: _originalValue,
      }));
      if (onChange) {
        onChange(Object.assign({}, e, { nativeEvent: { text: _originalValue } }));
      }
      if (onChangeValue) {
        onChangeValue(_originalValue);
      }
    }, []);

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

    const toggleSecure = useCallback(() => {
      setState((prevState) => ({
        ...prevState,
        secure: !prevState.secure,
      }));
    }, []);

    useImperativeHandle(
      ref,
      () =>
        Object.assign(innerRef.current as NativeTextInput, {
          getState: () => cloneDeep(state),
        }) as TextInputMethods,
      [state, innerRef.current]
    );

    useEffect(() => {
      if (!!value) {
        setState({
          ...state,
          tempValue: parseValue(value),
          valueType: typeof value,
          type,
        });
      }
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
    const finalContainerButtonStyle = StyleSheet.flatten([
      styles.buttonContainer,
      secureProps?.containerStyle,
    ]);

    return (
      <>
        <NativeTextInput
          textAlignVertical={type === 'multiline' ? 'top' : 'center'}
          {...props}
          multiline={type === 'multiline'}
          numberOfLines={type === 'multiline' ? 4 : undefined}
          onChange={_onChange}
          value={state.tempValue}
          secureTextEntry={state.secure}
          style={finalStyle}
          ref={innerRef}
          keyboardType={keyboardType}
        />
        {type === 'password' && (
          <ButtonIcon
            name={state.secure ? 'eye-off' : 'eye'}
            {...secureProps}
            onPress={toggleSecure}
            containerStyle={finalContainerButtonStyle}
          />
        )}
      </>
    );
  }
);

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
});

_TextInput.displayName = 'Input.Text';
export const TextInput = withConfig(_TextInput);
