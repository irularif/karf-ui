import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import withConfig, { RNFunctionComponent } from '../helpers/withConfig';
import { useScreen } from '../hooks';

export interface ListProps<T> extends FlatListProps<T> {}

const _List: RNFunctionComponent<ListProps<any>> = ({ theme, ...props }) => {
  const { size } = useScreen();

  return <FlatList key={size} {...props} />;
};

_List.displayName = 'List';
export const List = withConfig(_List);
