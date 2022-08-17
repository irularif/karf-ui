import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, ViewProps } from '../View';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';

export interface ShimmerProps extends ViewProps {
  colors?: string[];
  locations?: number[];
}

const SCREEN_WIDTH = Dimensions.get('screen').width;
const START = -1;
const END = 1;
const DURATION = 2000;
const ANIMATION = new Animated.Value(START);

const runAnimation = () => {
  ANIMATION.setValue(START);
  Animated.timing(ANIMATION, {
    toValue: END,
    useNativeDriver: true,
    duration: DURATION,
    easing: Easing.inOut(Easing.ease),
  }).start(runAnimation);
};

const linear = ANIMATION.interpolate({
  inputRange: [START, END],
  outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
});

runAnimation();

const _Shimmer: RNFunctionComponent<ShimmerProps> = ({
  colors = ['#eee', '#ddd', '#eee'],
  locations = [0.2, 0.5, 0.8],
  style,
  ...props
}) => {
  const ref: any = useRef();
  const [positionX, setPositionX] = useState<number | undefined>();

  const onLayout = useCallback(() => {
    ref.current?.measure?.(
      (_x: number, _y: number, _width: number, _height: number, pageX: number, _pageY: number) => {
        setPositionX(pageX);
      }
    );
  }, [ref]);

  const finalStyle = StyleSheet.flatten([styles.shimmer, style]);

  return (
    // @ts-ignore
    <View style={finalStyle} ref={ref} onLayout={onLayout} {...props}>
      {positionX !== undefined && (
        <Animated.View
          style={{
            flex: 1,
            left: -positionX,
            transform: [{ translateX: linear }],
          }}
        >
          <LinearGradient
            style={{ flex: 1, width: SCREEN_WIDTH }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={locations}
            colors={colors}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shimmer: {
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
});

_Shimmer.displayName = 'Shimmer';
export const Shimmer = withConfig(_Shimmer);
