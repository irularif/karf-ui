import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import withConfig, { RNFunctionComponent } from '../helpers/withConfig';

export interface ListProps<T> extends FlatListProps<T> {}

export const List: RNFunctionComponent<ListProps<any>> = withConfig(({ ...props }) => {
  return <FlatList {...props} />;
});
