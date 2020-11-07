import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Animated, {
  Transitioning,
  Transition,
  Clock,
  Easing,
  block,
  cond,
  clockRunning,
  timing,
  eq,
  stopClock,
  set,
} from 'react-native-reanimated';

import Card from './src/components/Card';

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

const emojis = '😀 😃 😄 😁 😆 😅'.split(' ');

export default function App() {
  const [items, setItems] = useState(
    emojis.concat(emojis).map((v, index) => (
      <View key={index.toString()} style={{ padding: 1 }}>
        <Card text={v} />
      </View>
    ))
  );

  const transition = (
    <Transition.Together>
      <Transition.Change interpolation="easeInOut" propagation="top" />
    </Transition.Together>
  );

  const ref = useRef();

  return (
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={styles.container}
    >
      {items}

      <View style={{ position: 'absolute' }}>
        <Button
          title="shuffle"
          color="#FF5252"
          onPress={() => {
            ref.current.animateNextTransition();
            const shuffled = items.slice();
            shuffle(shuffled);
            setItems(shuffled);
          }}
        />
      </View>

      <StatusBar style="auto" hidden />
    </Transitioning.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
});
