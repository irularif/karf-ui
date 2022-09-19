import { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  RefreshControl,
  RefreshControlProps,
  ScrollView as NativeScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ComponentProps, renderNode } from '../helpers';
import withConfig from '../helpers/withConfig';
import { ScrollView, ScrollViewProps } from '../ScrollView';
import { View } from '../View';

interface TItem<T> {
  item: T;
  index: number;
}

export interface MasonryListProps<T> extends ScrollViewProps {
  numColumns?: number;
  refreshing?: RefreshControlProps['refreshing'];
  onRefresh?: RefreshControlProps['onRefresh'];
  onEndReached?: () => void;
  renderItem: ({ item, index }: TItem<T>) => React.ReactElement | null;
  keyExtractor?: ((item: T, index: number) => string) | undefined;
  onEndReachedThreshold?: number;
  style?: StyleProp<ViewStyle>;
  data: T[];
  ListEmptyComponent?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  ListHeaderComponentStyle?: StyleProp<ViewStyle>;
  ListFooterComponent?: React.ReactNode;
  ListFooterComponentStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const isCloseToBottom = (
  { layoutMeasurement, contentOffset, contentSize }: any,
  onEndReachedThreshold: number
) => {
  const paddingToBottom = contentSize.height * onEndReachedThreshold;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const _MasonryList = <T extends unknown>(
  {
    data = [],
    numColumns = 1,
    refreshing: _refreshing,
    onScroll,
    onEndReached,
    renderItem,
    onRefresh: _onRefresh,
    onEndReachedThreshold,
    ListHeaderComponent,
    ListHeaderComponentStyle,
    ListFooterComponent,
    ListFooterComponentStyle,
    style,
    containerStyle,
    contentContainerStyle,
    ...props
  }: ComponentProps<MasonryListProps<T>>,
  ref: React.ForwardedRef<NativeScrollView>
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listenerScroll = useCallback((e: any) => {
    const { nativeEvent } = e;
    if (isCloseToBottom(nativeEvent, onEndReachedThreshold || 0.1))
      onEndReached === null || onEndReached === void 0 ? void 0 : onEndReached();
    if (!!onScroll && typeof onScroll === 'function') {
      onScroll(e);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    _onRefresh === null || _onRefresh === void 0 ? void 0 : _onRefresh();
    setIsRefreshing(false);
  }, []);

  const refreshing = useMemo(() => !!(_refreshing || isRefreshing), [_refreshing, isRefreshing]);

  return (
    <ScrollView
      {...props}
      // @ts-ignore
      ref={ref}
      refreshControl={
        <RefreshControl refreshing={!!(refreshing || isRefreshing)} onRefresh={onRefresh} />
      }
      scrollEventThrottle={16}
      onScroll={listenerScroll}
      style={containerStyle}
      contentContainerStyle={contentContainerStyle}
    >
      <View style={ListHeaderComponentStyle}>{ListHeaderComponent}</View>
      <RenderList
        renderItem={renderItem}
        data={data}
        numColumns={numColumns}
        style={style}
        {...props}
      />
      <View style={ListFooterComponentStyle}>{ListFooterComponent}</View>
    </ScrollView>
  );
};

interface IRenderList<T> extends MasonryListProps<T> {
  data: Array<T>;
}

const RenderList = <T extends unknown>({
  data,
  ListEmptyComponent,
  horizontal,
  style,
  numColumns = 1,
  renderItem,
  keyExtractor,
}: IRenderList<T>) => {
  if (data.length === 0 && ListEmptyComponent) {
    return renderNode(ListEmptyComponent, {});
  }

  const finalRowStyle = StyleSheet.flatten([
    Styles.row,
    {
      flexDirection: horizontal ? 'column' : 'row',
    },
    style,
  ]);

  const finalColumnStyle = StyleSheet.flatten([
    {
      flex: 1 / numColumns,
      flexDirection: horizontal ? 'row' : 'column',
    },
  ]);
  let key = 0;

  return (
    // @ts-ignore
    <View style={finalRowStyle}>
      {Array.from(Array(numColumns), (_, num) => {
        key += 1;
        return (
          // @ts-ignore
          <View key={String(key) + String(num)} style={finalColumnStyle}>
            {data
              .map((el, i) => {
                if (i % numColumns === num) {
                  const key = !!keyExtractor ? keyExtractor(el, i) : String(num) + String(i);
                  const Component = renderItem({ item: el, index: i });
                  return renderNode(Component?.type, {
                    key,
                    ...Component?.props,
                  });
                }
                return null;
              })
              .filter((e) => !!e)}
          </View>
        );
      })}
    </View>
  );
};

const Styles = StyleSheet.create({
  row: {
    flex: 1,
  },
});

_MasonryList.displayName = 'MasonryList';
export const MasonryList = withConfig(forwardRef(_MasonryList));
