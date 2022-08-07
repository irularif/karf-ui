import React from 'react';
import { StyleSheet } from 'react-native';
import withConfig from '../helpers/withConfig';
import { View, ViewProps } from '../View';

export interface FieldSuffixProps extends ViewProps {}

const _FieldSuffix: React.FC<FieldSuffixProps> = ({ children, style, ...props }) => {
  const finalStyle = StyleSheet.flatten([styles.basic, style]);

  return (
    <View {...props} style={finalStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  basic: {
    flexDirection: 'row',
  },
});

_FieldSuffix.displayName = 'Field.Suffix';
export const FieldSuffix = withConfig(_FieldSuffix);
