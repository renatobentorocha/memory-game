import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  block,
  Clock,
  clockRunning,
  cond,
  Easing,
  eq,
  Extrapolate,
  interpolate,
  not,
  set,
  startClock,
  timing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// import { Container } from './styles';

const COLORS = ['#B34D02', '#E56300', '#FF6E02'];

const runProgress = (
  clock: Clock,
  intialPosition: number,
  toValue: number,
  duration: number
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
    cond(not(clockRunning(clock)), startClock(clock)),
    timing(clock, state, config),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.position, intialPosition),
    ]),
    state.position,
  ]);
};

const Loading: React.FC = () => {
  const clocks = useRef(COLORS.map((_) => new Clock())).current;

  const progress = clocks.map((clock, i) =>
    runProgress(clock, 0, 10, i === 1 ? 1000 : 2000)
  );

  // const opacity = interpolate(progress, {
  //   inputRange: [270, 310, 360],
  //   outputRange: [0, 1, 0],
  //   extrapolate: Extrapolate.CLAMP,
  // });

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {COLORS.map((color, index) => {
        const center = width / 2 - 40 / 2;
        let left = center;
        const next = center + 40 + 30;

        const first = center - 40 - 30;
        const middle = center + 30;
        const third = center + 40 + 30;

        if (index === 0) {
          left = center - 40 - 30;
          // next = center;
        } else if (index === 2) {
          left = center + 40 + 30;
          // next = center - 40 - 30;
        }

        // left = center - 40 - 30;
        let inputRangeTransX = [0, 0.00001, 5, 5.000005, 9.00009, 10];
        let outputRangeTransX = [
          left,
          left - 0.00001,
          third,
          third - 0.00001,
          left - 0.00001,
          left,
        ];

        let inputRangeScale = [0, 0.00001, 5.00009, 6, 9.00009, 10];

        let outputRangeScale = [1, 1, 1, 0.1, 0.1, 1];

        if (index === 1) {
          inputRangeTransX = [0, 0.00001, 5, 5.000005, 7, 7.09, 9.999999, 10];
          outputRangeTransX = [
            left,
            left - 0.00001,
            third,
            third - 0.00001,
            first,
            first - 0.00001,
            left,
            left - 0.00001,
          ];

          inputRangeScale = [0, 0.00001, 5, 5.2, 7, 7.09, 9.999999, 10];
          outputRangeScale = [1, 1, 1, 0.1, 0.1, 1, 1, 1];
        }

        if (index === 2) {
          inputRangeTransX = [0, 0.00001, 5, 5.000005, 9.00009, 10];
          outputRangeTransX = [
            left,
            left - 0.00001,
            first,
            first - 0.00001,
            left,
            left - 0.00001,
          ];

          inputRangeScale = [0, 0.999, 5, 5.6, 9.00009, 10];
          outputRangeScale = [1, 0.1, 0.1, 1, 1, 1];
        }

        const translateX = interpolate(progress[index], {
          inputRange: inputRangeTransX,
          outputRange: outputRangeTransX,
          extrapolate: Extrapolate.CLAMP,
        });

        const scale = interpolate(progress[index], {
          inputRange: inputRangeScale,
          outputRange: outputRangeScale,
          extrapolate: Extrapolate.CLAMP,
        });

        // const show = index === 0 || index === 1;
        const show = index === index;
        return (
          show && (
            <Animated.View
              style={[
                styles.circle,
                { backgroundColor: color, left: translateX },
                { transform: [{ scale }] },
              ]}
              key={index.toString()}
            />
          )
        );
      })}
    </View>
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

export { Loading };
