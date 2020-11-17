import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  block,
  clockRunning,
  cond,
  debug,
  Easing,
  eq,
  not,
  onChange,
  set,
  startClock,
  stopClock,
  timing,
  useCode,
} from 'react-native-reanimated';

type Props = {
  color: string;
  position: number;
  beginState: number;
  translateTo: number;
};

const scaleWithTiming = (
  clock: Animated.Clock,
  intialPosition: Animated.Value<number>,
  toValue: Animated.Value<number>,
  duration: number,
  invert: Animated.Value<number>,
  startTranslateX: Animated.Value<number>
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
    timing(clock, state, config),
    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(invert, not(invert)),
      set(startTranslateX, 1),
    ]),
    state.position,
  ]);
};

const translateWithTiming = (
  clock: Animated.Clock,
  intialPosition: number,
  toValue: Animated.Value<number>,
  duration: number,
  startTranslateX: Animated.Value<number>,
  startScale: Animated.Value<number>
) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(intialPosition),
    frameTime: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue,
    duration,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    timing(clock, state, config),
    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(startTranslateX, 0),
      set(startScale, not(startScale)),
    ]),
    state.position,
  ]);
};

const Circle = ({ color, position, beginState, translateTo }: Props) => {
  const clockScale = useRef(new Animated.Clock()).current;
  const clockTranslate = useRef(new Animated.Clock()).current;
  const invert = useRef(new Animated.Value<number>(0)).current;
  const fromScale = useRef(new Animated.Value<number>(0)).current;
  const toScale = useRef(new Animated.Value<number>(1)).current;
  const startScale = useRef(new Animated.Value<number>(beginState)).current;
  const startTranslateX = useRef(new Animated.Value<number>(0)).current;
  const scale = useRef(new Animated.Value<number>(0)).current;
  const translateX = useRef(new Animated.Value<number>(position)).current;

  const toTranslateX = useRef(new Animated.Value<number>(translateTo)).current;

  useCode(() => onChange(startScale, [startClock(clockScale)]), []);
  /** scale useCode  */
  useCode(
    () => [
      onChange(invert, [
        cond(
          invert,
          [set(fromScale, 1), set(toScale, 0), set(toTranslateX, position)],
          [set(fromScale, 0), set(toScale, 1), set(toTranslateX, translateTo)]
        ),
      ]),
      cond(startScale, startClock(clockScale)),

      cond(
        clockRunning(clockScale),
        set(
          scale,
          scaleWithTiming(
            clockScale,
            fromScale,
            toScale,
            500,
            invert,
            startTranslateX
          )
        )
      ),
    ],
    []
  );

  useCode(
    () =>
      onChange(startTranslateX, [
        debug('startTranslateX', startTranslateX),
        cond(startTranslateX, startClock(clockTranslate)),
      ]),
    []
  );
  /** translate useCode  */
  useCode(
    () => [
      cond(
        clockRunning(clockTranslate),
        set(
          translateX,
          translateWithTiming(
            clockTranslate,
            position,
            toTranslateX,
            500,
            startTranslateX,
            startScale
          )
        )
      ),
    ],
    []
  );

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          backgroundColor: color,
          left: translateX,
        },
        {
          transform: [{ scale }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export { Circle };
