import { FlashList, FlashListProps, ListRenderItem } from '@shopify/flash-list';
import React, { forwardRef } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { extractStyle, getStyleValue } from '../helpers';
import withConfig, { ComponentProps } from '../helpers/withConfig';
import { useScreen } from '../hooks';
import { View } from '../View';

export interface ListProps<T> extends FlashListProps<T> {
  data: ReadonlyArray<T>;
  containerStyle?: StyleProp<ViewStyle>;
  renderItem: ListRenderItem<T>;
}

const _List = <T extends unknown>(
  {
    theme,
    data = [],
    renderItem,
    containerStyle,
    style,
    contentContainerStyle,
    estimatedItemSize = 100,
    ...props
  }: ComponentProps<ListProps<T>>,
  ref: React.ForwardedRef<FlashList<T>>
) => {
  const { size } = useScreen();
  const finalContainerStyle = StyleSheet.flatten([styles.container, containerStyle]);
  const finalStyle = StyleSheet.flatten([styles.list, style, contentContainerStyle]);
  const padding = extractStyle(finalContainerStyle, ['padding', 'margin']);
  const inset = {
    top: -getStyleValue(
      padding,
      ['padding', 'paddingVertical', 'paddingTop', 'margin', 'marginVertical', 'marginTop'],
      0
    ),
    bottom: -getStyleValue(
      padding,
      ['padding', 'paddingVertical', 'paddingBottom', 'margin', 'marginVertical', 'marginBottom'],
      0
    ),
    left: -getStyleValue(
      padding,
      ['padding', 'paddingHorizontal', 'paddingLeft', 'margin', 'marginHorizontal', 'marginLeft'],
      0
    ),
    right: -getStyleValue(
      padding,
      ['padding', 'paddingHorizontal', 'paddingRight', 'margin', 'marginHorizontal', 'marginRight'],
      0
    ),
  };

  return (
    <View style={finalContainerStyle}>
      <FlashList
        ref={ref}
        key={size}
        data={data}
        renderItem={renderItem}
        contentContainerStyle={finalStyle}
        estimatedItemSize={estimatedItemSize}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {},
});

_List.displayName = 'List';
export const List = withConfig(forwardRef(_List));
