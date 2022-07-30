import { get } from 'lodash';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import { getIconStyle, getIconType } from '../helpers/icon';
import withConfig from '../helpers/withConfig';

export type IconType =
  | (string & {})
  | 'material'
  | 'material-community'
  | 'simple-line-icon'
  | 'zocial'
  | 'font-awesome'
  | 'octicon'
  | 'ionicon'
  | 'foundation'
  | 'evilicon'
  | 'entypo'
  | 'antdesign'
  | 'font-awesome-5'
  | 'feather'
  | 'ant-design'
  | 'fontisto';

export interface IconProps {
  type?: IconType;
  name: string;
  color?: string;
  size?: number;
  solid?: boolean;
  brand?: boolean;
  style?: StyleProp<TextStyle>;
}

const _Icon: RNFunctionComponent<IconProps> = ({
  type,
  name,
  solid,
  brand,
  style,
  theme,
  size = 18,
  ...props
}) => {
  const color = get(props, 'color', theme?.colors?.black);
  const IconComponent = getIconType(type, name);
  const iconSpecificStyle = getIconStyle(type, { solid, brand });
  const finalStyle = StyleSheet.flatten([styles.basic, theme?.style, style]);

  return (
    <IconComponent
      {...iconSpecificStyle}
      name={name}
      size={size}
      width={size}
      height={size}
      color={color}
      style={finalStyle}
    />
  );
};

const styles = StyleSheet.create({
  basic: {
    marginHorizontal: 2,
  },
});

_Icon.displayName = 'Icon';
export const Icon = withConfig(_Icon);
