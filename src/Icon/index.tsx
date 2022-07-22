import { get } from 'lodash';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import { getIconStyle, getIconType } from '../helpers/icon';
import withTheme from '../helpers/withTheme';
import { View } from '../View';

export type IconType =
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
  | string;

export interface IconProps {
  type?: IconType;
  name: string;
  color?: string;
  size?: number;
  solid?: boolean;
  brand?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Icon: RNFunctionComponent<IconProps> = withTheme(
  ({ type, name, solid, brand, style, theme, ...props }) => {
    const size = get(props, 'size', 18);
    const color = get(props, 'color', theme?.colors?.black);
    const IconComponent = getIconType(type);
    const iconSpecificStyle = getIconStyle(type, { solid, brand });
    const finalStyle = StyleSheet.flatten([styles.basic, theme?.style, style]);

    return (
      <View style={finalStyle}>
        <IconComponent
          name={name}
          size={size}
          width={size}
          height={size}
          color={color}
          {...iconSpecificStyle}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  basic: {
    padding: 2,
  },
});
