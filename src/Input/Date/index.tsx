import RNDateTimePicker, {
  BaseProps,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { get } from 'lodash';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button, ButtonProps } from '../../Button';
import { format, parseISO, RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';
import { Modal } from '../../Modal';
import { View } from '../../View';

export type DateInputMethods = {};
export interface DateInputProps extends ButtonProps {
  placeholder?: string;
  type?: 'date' | 'time' | 'datetime';
  value?: string;
  valueFormat?: string;
  labelFormat?: string;
  onChange?: (value: Date) => void;
  onChangeValue?: (value: string) => void;
  datePickerProps?: Partial<
    Omit<BaseProps, 'value' | 'mode' | 'display' | 'themeVariant' | 'onChange'>
  >;
}

const _DateInput: RNFunctionComponent<DateInputProps> = forwardRef(
  (
    {
      type = 'date',
      value,
      placeholder,
      labelFormat,
      valueFormat,
      children,
      theme,
      datePickerProps,
      style,
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState({
      value: new Date(),
      originalValue: '',
      type: type,
      mode: (type === 'datetime' ? 'date' : type) as 'date' | 'time' | 'datetime',
      visible: false,
    });

    const toggleModal = useCallback(() => {
      setState((state) => ({ ...state, visible: !state.visible }));
    }, []);

    const parseValue = useCallback(
      (value: Date) => {
        if (type === 'datetime') {
          if (valueFormat) {
            return format(value, valueFormat);
          }
          return value.toJSON();
        }
        if (type === 'time') {
          return value.toJSON();
        }
        return format(value, valueFormat || 'EEEE MMM d, yyyy');
      },
      [valueFormat, type]
    );

    const _handleAndroid = useCallback(
      (event: DateTimePickerEvent, date?: Date) => {
        if (event.type !== 'dismissed' && !!date) {
          if (state.type === 'datetime' && state.mode === 'date') {
            setState((state) => ({ ...state, value: date, mode: 'time' }));
          } else if (!!date) {
            setState((state) => ({
              ...state,
              value: date || state.value,
              originalValue: parseValue(date),
              mode: type === 'datetime' ? 'date' : type,
              visible: false,
            }));
          }
        } else {
          setState((state) => ({
            ...state,
            value: !!state.originalValue ? parseISO(state.originalValue) : new Date(),
            mode: type === 'datetime' ? 'date' : type,
            visible: false,
          }));
        }
      },
      [state, parseValue]
    );
    const _handleIOS = useCallback(
      (dismiss: boolean = true) => {
        if (!dismiss) {
          if (state.type === 'datetime' && state.mode === 'date') {
            setState((state) => ({ ...state, mode: 'time' }));
          } else {
            setState((state) => ({
              ...state,
              originalValue: parseValue(state.value),
              mode: type === 'datetime' ? 'date' : type,
              visible: false,
            }));
          }
        } else {
          setState((state) => ({
            ...state,
            value: !!state.originalValue ? parseISO(state.originalValue) : new Date(),
            mode: type === 'datetime' ? 'date' : type,
            visible: false,
          }));
        }
      },
      [state, parseValue]
    );
    const _onChange = useCallback(
      (event: DateTimePickerEvent, date?: Date) => {
        if (Platform.OS === 'android') {
          _handleAndroid(event, date);
        } else if (Platform.OS === 'ios') {
          console.log(date);
          setState((state) => ({
            ...state,
            value: date || state.value,
          }));
        }
      },
      [_handleAndroid, _handleIOS]
    );

    const label = useMemo(() => {
      let _labelFormat = labelFormat || type === 'time' ? 'HH:mm' : 'EEEE MMM d, yyyy';
      if (!state.originalValue) {
        return placeholder;
      }
      if (type === 'datetime') {
        _labelFormat = `${_labelFormat} HH:mm`;
      }
      return format(state.value, _labelFormat);
    }, [state, type, value, labelFormat, placeholder]);

    useEffect(() => {
      if (value) {
        setState((state) => ({
          ...state,
          value: parseISO(value),
          originalValue: value,
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

    return (
      <>
        <Button
          {...props}
          variant="text"
          style={finalButtonStyle}
          containerStyle={finalContainerButtonStyle}
          onPress={toggleModal}
        >
          {!!children ? (
            children
          ) : (
            <>
              <Button.Label style={finalLabelButtonStyle}>{label}</Button.Label>
              <Button.RightIcon name={type === 'time' ? 'time' : 'calendar'} />
            </>
          )}
        </Button>
        {state.visible && Platform.OS === 'android' ? (
          <RNDateTimePicker
            {...datePickerProps}
            onChange={_onChange}
            mode={state.mode}
            value={state.value}
            themeVariant={theme?.mode}
          />
        ) : Platform.OS === 'ios' ? (
          <Modal
            position="bottom"
            insetBottom
            isOpen={state.visible}
            onDismiss={() => _handleIOS()}
          >
            <View style={styles.modal}>
              <RNDateTimePicker
                {...datePickerProps}
                onChange={_onChange}
                mode={state.mode}
                value={state.value}
                themeVariant={theme?.mode}
                display="spinner"
              />
              <View style={styles.wrapperButton}>
                <Button variant="text" onPress={() => _handleIOS()}>
                  <Button.Label>CANCEL</Button.Label>
                </Button>
                <Button variant="text" onPress={() => _handleIOS(false)}>
                  <Button.Label>OK</Button.Label>
                </Button>
              </View>
            </View>
          </Modal>
        ) : null}
      </>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  containerButton: {
    flexGrow: 1,
    margin: 0,
    borderRadius: 0,
  },
  modal: {
    padding: 16,
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
});

_DateInput.displayName = 'Input.Date';
export const DateInput = withConfig(_DateInput);
