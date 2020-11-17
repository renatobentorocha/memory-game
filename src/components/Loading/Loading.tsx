import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  and,
  block,
  Clock,
  clockRunning,
  cond,
  debug,
  Easing,
  eq,
  Extrapolate,
  interpolate,
  not,
  onChange,
  set,
  startClock,
  stopClock,
  timing,
} from 'react-native-reanimated';
import { Circle } from './Circle';

const { width } = Dimensions.get('window');

// import { Container } from './styles';

const COLORS = ['#FF6E02', '#E56300', '#B34D02'];

const scaleWithTiming = (
  clock: Clock,
  intialPosition: Animated.Value<number>,
  toValue: Animated.Value<number>,
  duration: number,
  invert: Animated.Value<number>,
  startTranslateX: Animated.Value<number>,
  startScale: Animated.Value<number>
) => {
  const state = {
    finished: new Animated.Value(0),
    position: intialPosition,
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue,
    duration,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    // cond(invert, [
    //   set(state.position, new Animated.Value(toValue)),
    //   set(config.toValue, new Animated.Value(intialPosition)),
    // ]),
    cond(clockRunning(clock), timing(clock, state, config)),

    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(invert, not(invert)),
      set(startTranslateX, 1),
      // set(startScale, 0),
      // debug('startScale SCALE', startScale),
    ]),
    state.position,
  ]);
};

const translateWithTiming = (
  clock: Clock,
  intialPosition: number,
  toValue: number,
  duration: number,
  startTranslateX: Animated.Value<number>,
  startScale: Animated.Value<number>[],
  index: number
) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(intialPosition),
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue: new Animated.Value(toValue),
    duration,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config)),
    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(startTranslateX, 0),
      set(startScale[index], 1),
      debug('startTranslateX[index]', startTranslateX),
      // debug('startScale TRANS', startScale),
    ]),
    state.position,
  ]);
};

const Loading: React.FC = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {COLORS.map((color, index) => {
        const center = width / 2 - 40 / 2;
        let left = center - 40 - 30;
        const third = center + 40 + 30;

        if (index === 0) {
          left = center - 40 - 30;
          // next = center;
        } else if (index === 2) {
          left = center + 40 + 30;
          // next = center - 40 - 30;
        }

        // left = center - 40 - 30;

        return (
          <Circle
            key={index.toString()}
            color={color}
            position={left}
            beginState={index === 2 ? 1 : 0}
            translateTo={third}
          />
        );
      })}
    </View>
  );
};

export { Loading };
