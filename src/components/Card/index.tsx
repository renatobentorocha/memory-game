import React, { useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ORIGIN_DIMENSIONS } from '../../dimensions';
import Circle from '../svg/Circle';

import Animated, {
  Clock,
  Easing,
  block,
  cond,
  clockRunning,
  timing,
  eq,
  stopClock,
  set,
  event,
  useCode,
  startClock,
  interpolate,
  Extrapolate,
  concat,
  not,
} from 'react-native-reanimated';

import {
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

type Props = {
  text: string;
};

const CARD_WIDTH = ORIGIN_DIMENSIONS.width / 3 - 2;
const CARD_HEIGHT = ORIGIN_DIMENSIONS.height / 4;

const withTiming = (
  clock: Clock,
  position: Animated.Value<number>,
  toValue: Animated.Value<number>,
  invert: Animated.Value<number>
) => {
  const state: Animated.TimingState = {
    finished: new Animated.Value(0),
    position,
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config: Animated.TimingConfig = {
    toValue,
    duration: 500,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config)),

    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(invert, not(invert)),
    ]),

    state.position,
  ]);
};

const Card: React.FC<Props> = ({ text }) => {
  const clock = useRef(new Animated.Clock()).current;
  const invert = useRef(new Animated.Value<number>(0)).current;
  const from = useRef(new Animated.Value<number>(0)).current;
  const toValue = useRef(new Animated.Value<number>(1)).current;
  const progress = useRef(new Animated.Value<number>(0)).current;

  const rotateY = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 180],
    extrapolate: Extrapolate.CLAMP,
  });

  const opacityFront = interpolate(progress, {
    inputRange: [0.5, 0.51],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const opacityBack = interpolate(progress, {
    inputRange: [0.5, 0.51],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const scaleFront = interpolate(progress, {
    inputRange: [0.5, 0.51],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const scaleBack = interpolate(progress, {
    inputRange: [0.5, 0.51],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const tapState = useRef(new Animated.Value<State>(State.UNDETERMINED))
    .current;

  useCode(
    () =>
      block([
        cond(eq(tapState, State.BEGAN), startClock(clock)),
        cond(
          invert,
          [set(from, 1), set(toValue, 0)],
          [set(from, 0), set(toValue, 1)]
        ),
        cond(
          clockRunning(clock),
          set(progress, withTiming(clock, from, toValue, invert))
        ),
      ]),
    []
  );

  const onHandlerStateChange = event<TapGestureHandlerStateChangeEvent>([
    {
      nativeEvent: { state: tapState },
    },
  ]);

  return (
    <TapGestureHandler onHandlerStateChange={onHandlerStateChange}>
      <Animated.View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityBack,
              transform: [
                { perspective: 1200 },
                { rotateY: '180deg' },
                { rotateY: concat(rotateY, 'deg') },
                { scale: scaleBack },
              ],
            },
          ]}
        >
          <Circle width={120} height={120} />
          <Text style={styles.text}>{text}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityFront,
              transform: [
                { perspective: 1200 },
                { rotateY: concat(rotateY, 'deg') },
                { scale: scaleFront },
              ],
            },
          ]}
        />
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'orange',
    paddingHorizontal: 5,
    position: 'absolute',
  },
  text: {
    fontSize: 48,
    position: 'absolute',
    left: CARD_WIDTH / 2 - 52.3 / 2,
    top: CARD_HEIGHT / 2 - 57.7 / 2,
  },
});

export default Card;
