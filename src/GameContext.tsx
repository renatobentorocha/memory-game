import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Card from './components/Card';

export type CardProps = {
  id: number;
  isMatched: boolean;
  isSelected: boolean;
  text: string;
};

export type ContextType = {
  handleSelectCard: (id: string) => void;
  hasPair: (id: string) => boolean;
  selectedCards: string[];
  removeFromList: (text: string) => void;
  cardsProps: CardProps[];
  setCardsProps: React.Dispatch<React.SetStateAction<CardProps[]>>;
  shuffle: (
    callback: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => void;
  cards: JSX.Element[];
  setIsSelected: () => undefined;
  setIsMatched: () => undefined;
};

export const GameContext = React.createContext<ContextType>({
  hasPair: (id: string) => id !== id,
  handleSelectCard: () => undefined,
  selectedCards: [],
  removeFromList: () => undefined,
  cardsProps: [],
  setCardsProps: () => undefined,
  shuffle: () => undefined,
  cards: [],
  setIsSelected: () => undefined,
  setIsMatched: () => undefined,
});

const GameContextComponent: React.FC = ({ children }) => {
  const emojisList = '😀 😃 😄 😁 😆 😅'.split(' ');

  const [cardsProps, setCardsProps] = useState<CardProps[]>(
    emojisList.concat(emojisList).map((text, index) => ({
      id: index,
      isMatched: false,
      isSelected: false,
      text,
    }))
  );

  const [cards, setCards] = useState<JSX.Element[]>(
    cardsProps.map((cardProps, index) => (
      <View key={cardProps.id.toString()} style={{ padding: 1 }}>
        <Card
          id={cardProps.id}
          text={cardProps.text}
          isSelected={cardProps.isSelected}
          isMatched={cardProps.isMatched}
        />
      </View>
    ))
  );

  const setIsSelected = () => undefined;

  const setIsMatched = () => undefined;

  const _shuffle = (
    callback: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => {
    shuffle(callback);
  };

  const shuffle = (
    callback: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => {
    const shuffledCardsProps = cardsProps
      .slice()
      .sort(() => Math.random() - 0.5);

    setCardsProps(shuffledCardsProps);

    const shuffledCards = shuffledCardsProps.map((value) =>
      cards.find((props) => value.id.toString() === props.key)
    );

    callback(shuffledCards);
  };

  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleSelectCard = (id: string) => {
    setSelectedCards((v) => [...v, id]);
  };

  const hasPair = (id: string): boolean => {
    const index = selectedCards.findIndex((v) => {
      return v === id;
    });

    return index >= 0;
  };

  const removeFromList = (text: string) =>
    setSelectedCards(selectedCards.filter((t) => t !== text));

  return (
    <GameContext.Provider
      value={{
        hasPair,
        handleSelectCard,
        selectedCards,
        removeFromList,
        cardsProps,
        setCardsProps,
        shuffle: _shuffle,
        cards,
        setIsSelected,
        setIsMatched,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextComponent;
