import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ORIGIN_DIMENSIONS } from '../../dimensions';
import Circle from '../svg/Circle';

type Props = {
  text: string;
};

const CARD_WIDTH = ORIGIN_DIMENSIONS.width / 3 - 2;
const CARD_HEIGHT = ORIGIN_DIMENSIONS.height / 4;

const Card: React.FC<Props> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Circle width={120} height={120} />
      <Text style={styles.text}>{text}</Text>
    </View>
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
  },
  text: {
    fontSize: 48,
    position: 'absolute',
    left: CARD_WIDTH / 2 - 52.3 / 2,
    top: CARD_HEIGHT / 2 - 57.7 / 2,
  },
});

export default Card;
