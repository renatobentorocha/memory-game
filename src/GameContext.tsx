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
  handleSelectCard: (card: CardProps) => void;
  hasPair: (id: number, text: string) => boolean;
  selectedCards: CardProps[];
  removeFromList: (text: string) => void;
  cardsProps: CardProps[];
  setCardsProps: () => undefined;
  shuffle: (
    callback: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => void;
  dataCallback: React.Dispatch<
    React.SetStateAction<
      React.Dispatch<React.SetStateAction<JSX.Element[]>> | undefined
    >
  >;
  cards: JSX.Element[];
  setIsSelected: (
    id: number,
    setData: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => undefined;
  setIsMatched: (
    id: number,
    setData: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => undefined;
  isSelected: (id: number) => boolean;
};

export const GameContext = React.createContext<ContextType>({
  hasPair: () => false,
  handleSelectCard: () => undefined,
  selectedCards: [],
  removeFromList: () => undefined,
  cardsProps: [],
  setCardsProps: () => undefined,
  shuffle: () => undefined,
  dataCallback: () => undefined,
  cards: [],
  setIsSelected: () => undefined,
  setIsMatched: () => undefined,
  isSelected: () => false,
});

const GameContextComponent: React.FC = ({ children }) => {
  const emojisList = '😀 😃 😄 😁 😆 😅'.split(' ');

  const [dataCallback, setDataCallback] = useState<
    React.Dispatch<React.SetStateAction<JSX.Element[]>>
  >();

  const [cardsProps, setCardsProps] = useState<CardProps[]>(
    emojisList.concat(emojisList).map((text, index) => ({
      id: index,
      isMatched: false,
      isSelected: false,
      text,
    }))
  );

  const [cards, setCards] = useState<JSX.Element[]>();

  useEffect(() => {
    setCards(
      cardsProps.map((cardProps) => (
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
  }, []);

  const isSelected = (id: number) =>
    selectedCards.find((card) => card.id === id)?.isSelected;

  const updateCardsView = (
    cardsPropsSliced: CardProps[],
    cardPropsIndex: number[],
    setData: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => {
    const shuffledCards = cardsPropsSliced.map((value) =>
      cards?.find((props) => value.id.toString() === props.key)
    );

    for (let index = 0; index < cardPropsIndex.length; index++) {
      const cardIndex = cardPropsIndex[index];
      const cardProps = cardsPropsSliced[cardIndex];

      if (shuffledCards) {
        shuffledCards[cardIndex] = (
          <View key={cardProps.id.toString()} style={{ padding: 1 }}>
            <Card
              id={cardProps.id}
              text={cardProps.text}
              isSelected={cardProps.isSelected}
              isMatched={cardProps.isMatched}
            />
          </View>
        );
      }
    }

    setData(shuffledCards);
  };

  const updateCardProps = (id: number, prop: string) => {
    const cardsPropsSliced = cardsProps.slice();

    const cardPropsIndex = cardsPropsSliced.findIndex((c) => c.id === id);

    cardsPropsSliced[cardPropsIndex][prop] = !cardsPropsSliced[cardPropsIndex][
      prop
    ];

    setCardsProps(cardsPropsSliced);

    return { cardsPropsSliced, cardPropsIndex };
  };

  const setIsMatched = (
    id: number,
    setData: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => {
    return updateCardProps(id, 'isMatched', setData);
  };

  const setIsSelected = (
    id: number,
    text: string,
    setData: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => {
    const { cardPropsIndex, cardsPropsSliced } = updateCardProps(
      id,
      'isSelected',
      setData
    );

    updateCardsView(cardsPropsSliced, [cardPropsIndex], setData);
    handleSelectCard(cardsPropsSliced[cardPropsIndex]);

    const pair = hasPair(id, text);

    if (pair.length > 0) {
      const data: {
        cardsPropsSliced: CardProps[];
        cardPropsIndex: number;
      }[] = [setIsMatched(pair[0].id, setData)];
      data.push(setIsMatched(id, setData));

      updateCardsView(
        data[1].cardsPropsSliced,
        [data[0].cardPropsIndex, data[1].cardPropsIndex],
        setData
      );
    }
  };

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

  const [selectedCards, setSelectedCards] = useState<CardProps[]>([]);

  const handleSelectCard = (card: CardProps) => {
    setSelectedCards((v) => [...v, card]);
  };

  const hasPair = (id: number, text: string) => {
    return selectedCards.filter((v) => v.text === text);
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
        dataCallback: setDataCallback,
        isSelected,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextComponent;
