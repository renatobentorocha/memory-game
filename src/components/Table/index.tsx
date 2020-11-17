import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

import { Transitioning, Transition } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ContextType, GameContext } from '../../GameContext';
import TableContexProvider from '../../TableContext';
import Card, { CARD_HEIGHT } from '../Card';

const { width } = Dimensions.get('window');

export default function Table() {
  const { cardsProps, setCardsProps, cards, shuffle, refresh } = useContext<
    ContextType
  >(GameContext);

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

        <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#d1d1d1',
              width: width / 2,
              height: CARD_HEIGHT / 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (ref.current) {
                ref.current.animateNextTransition();
                shuffle(setData);
              }
            }}
          >
            <MaterialIcons name="update" size={24} color="#171717" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#d1d1d1',
              width: width / 2,
              height: CARD_HEIGHT / 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (ref.current) {
                ref.current.animateNextTransition();
                refresh();
              }
            }}
          >
            <MaterialCommunityIcons name="restart" size={24} color="#171717" />
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
