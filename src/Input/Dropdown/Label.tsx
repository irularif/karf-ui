import { get } from 'lodash';
import { ReactElement, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonLabelProps } from '../../Button';
import type { RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';
import type { DropdownState } from './Dropdown';

export interface DropdownLabelProps extends Omit<ButtonLabelProps, 'children'> {
  dropdownState: [DropdownState, React.Dispatch<React.SetStateAction<DropdownState>>];
  path?: {
    value: string;
    label: string;
  };
  children?: (state: DropdownState) => ReactElement;
  placeholder?: string;
  placeholderTextColor?: string;
}

const Label: RNFunctionComponent<DropdownLabelProps> = ({
  theme,
  children,
  dropdownState,
  placeholder,
  placeholderTextColor,
  path,
  ...props
}) => {
  const [state] = dropdownState;
  const mode = useMemo(() => {
    if (['select', 'radio', 'checkbox'].includes(state.type)) {
      return 'single';
    }
    return 'multiple';
  }, [state]);

  const label: string = useMemo(() => {
    let _label: string = placeholder || '';
    if (mode === 'multiple') {
      if (!!path) {
        _label = state.tempValue.map((x) => get(x, path.label, '')).join(', ');
      } else {
        if (typeof state.tempValue === 'object') {
          _label = get(Object.values(state.tempValue), '0', '');
        } else {
          _label = String(state.tempValue);
        }
      }
    } else {
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

  return <Button.Label style={style}>{!!children ? children(state) : label}</Button.Label>;
};

const styles = StyleSheet.create({
  label: {
    textAlign: 'left',
    marginLeft: 0,
    fontWeight: '400',
  },
});

Label.displayName = 'Dropdown.Label';
export const DropdownLabel = withConfig(Label);
