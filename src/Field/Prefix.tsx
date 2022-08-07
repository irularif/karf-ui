import React from 'react';
import { StyleSheet } from 'react-native';
import withConfig from '../helpers/withConfig';
import { View, ViewProps } from '../View';

export interface FieldPrefixProps extends ViewProps {}

const _FieldPrefix: React.FC<FieldPrefixProps> = ({ children, style, ...props }) => {
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

_FieldPrefix.displayName = 'Field.Prefix';
export const FieldPrefix = withConfig(_FieldPrefix);
