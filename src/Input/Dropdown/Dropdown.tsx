import { cloneDeep, get } from 'lodash';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from '../../Button';
import type { RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';
import { List } from '../../List';
import { Popover } from '../../Popover';
import type { ITheme } from '../../ThemeProvider/context';
import { View } from '../../View';

type TType = 'select' | 'radio' | 'checkbox' | 'multiple-checkbox';
type TValue<Mode> = Mode extends 'multiple' ? Array<string | number> : string | number;
export type DropdownState<Mode = 'single'> = {
  value: TValue<Mode>;
  tempValue: TValue<Mode>;
  type: TType;
  visible: boolean;
};
export type DropdownInputMethods = {
  getState: () => DropdownState;
};
export interface DropdownProps extends ButtonProps {
  type?: TType;
  path?: {
    value: string;
    label: string;
  };
  data: Array<any>;
  placeholder?: string;
  placeholderTextColor?: string;
}

const _Dropdown: RNFunctionComponent<DropdownProps> = forwardRef(
  (
    {
      path,
      type = 'select',
      style,
      theme,
      placeholder = 'Select',
      placeholderTextColor,
      onFocus,
      onBlur,
      onLayout,
      children,
      data = [],
      ...props
    },
    ref
  ) => {
    const mode = useMemo(() => {
      if (['select', 'radio', 'checkbox'].includes(type)) {
        return 'single';
      }
      return 'multiple';
    }, [type]);
    const dropdownState = useState<DropdownState<typeof mode>>({
      tempValue: mode === 'single' ? '' : [],
      value: mode === 'single' ? '' : [],
      type: type,
      visible: false,
    });
    const [state, setState] = dropdownState;

    useImperativeHandle(
      ref,
      () =>
        Object.assign({
          getState: () => cloneDeep(state),
          focus: () => {
            toggleModal(state);
          },
        }) as DropdownInputMethods,
      [state]
    );

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

    const finalButtonStyle = StyleSheet.flatten([
      styles.button,
      {
        backgroundColor: get(style, 'backgroundColor', theme?.colors.grey500),
      },
      style,
    ]);
    const finalContainerButtonStyle = StyleSheet.flatten([styles.containerButton]);

    return (
      <Popover
        wrapperStyle={finalContainerButtonStyle}
        withoutArrow
        withoutShadow
        toggleAction="onPress"
        position="bottom"
      >
        <Popover.Trigger
          {...props}
          variant="text"
          style={finalButtonStyle}
          containerStyle={finalContainerButtonStyle}
          // onPress={toggleModal}
          // containerProps={{ onLayout }}
        >
          <RenderLabel
            dropdownState={dropdownState}
            children={children}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            path={path}
            theme={theme}
          />
        </Popover.Trigger>
        <Popover.Content>
          <List 
            data={data}
            renderItem={() => <View />}
          />
        </Popover.Content>
      </Popover>
    );
  }
);

interface IRenderLabel extends Partial<DropdownProps> {
  dropdownState: [
    DropdownState<'multiple' | 'single'>,
    React.Dispatch<React.SetStateAction<DropdownState<'multiple' | 'single'>>>
  ];
  theme?: ITheme;
}
const RenderLabel = ({
  dropdownState,
  children,
  placeholder,
  placeholderTextColor,
  path,
  theme,
}: IRenderLabel) => {
  const [state] = dropdownState;
  const isEmptyValue = useMemo(() => {
    if (Array.isArray(state.tempValue) && !state.tempValue.length) {
      return true;
    } else {
      return !state.tempValue;
    }
  }, [state]);
  const mode = useMemo(() => {
    if (['select', 'radio', 'checkbox'].includes(state.type)) {
      return 'single';
    }
    return 'multiple';
  }, [state]);

  const label: string = useMemo(() => {
    let _label: string = placeholder || '';
    if (mode === 'multiple' && Array.isArray(state.tempValue)) {
      if (!!path) {
        _label = state.tempValue.map((x) => get(x, path.label, '')).join(', ');
      } else {
        if (typeof state.tempValue === 'object') {
          _label = get(Object.values(state.tempValue), '0', '');
        } else {
          _label = String(state.tempValue);
        }
      }
    } else if (!!state.tempValue) {
      if (!!path) {
        _label = get(state.tempValue, path.label, '');
      } else {
        if (typeof state.tempValue === 'object') {
          _label = get(Object.values(state.tempValue), '0', '');
        } else {
          _label = String(state.tempValue);
        }
      }
    }
    return _label;
  }, [state, placeholder]);

  const style = StyleSheet.flatten([
    styles.label,
    label === placeholder
      ? {
          color: placeholderTextColor || theme?.colors.grey400,
        }
      : {
          color: theme?.colors.black,
        },
  ]);

  return (
    <>
      <Button.Label style={style}>
        {/* {!!children && !isEmptyValue ? children(state) : label} */}
        {label}
      </Button.Label>
      <Button.RightIcon name="chevron-down" color={theme?.colors.grey500} />
    </>
  );
};

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
  scrollView: {
    padding: 20,
  },
  label: {
    textAlign: 'left',
    marginLeft: 0,
    fontWeight: '400',
  },
});

_Dropdown.displayName = 'Input.Dropdown';
export const DropdownBase = withConfig(_Dropdown);
