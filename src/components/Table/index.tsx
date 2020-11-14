import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';

import { Transitioning, Transition } from 'react-native-reanimated';
import { ContextType, GameContext } from '../../GameContext';
import TableContexProvider from '../../TableContext';
import Card from '../Card';

export default function Table() {
  const { cardsProps, setCardsProps, cards, shuffle } = useContext<ContextType>(
    GameContext
  );

  const [data, setData] = useState<JSX.Element[]>([]);

  useEffect(() => setData(cards), [cards]);

  const transition = (
    <Transition.Together>
      <Transition.Change interpolation="easeInOut" propagation="top" />
    </Transition.Together>
  );

  const ref = useRef();

  return (
    <TableContexProvider setData={setData}>
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={styles.container}
      >
        {data}

        <View style={{ position: 'absolute', bottom: 0 }}>
          <TouchableOpacity
            onPress={() => {
              if (ref.current) {
                ref.current.animateNextTransition();
                shuffle(setData);
              }
            }}
          >
            <Text>shuffle</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" hidden />
      </Transitioning.View>
    </TableContexProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#171717',
  },
});
