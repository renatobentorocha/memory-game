import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Card from './components/Card';
import { emojisList } from './components/Emojis';

export type CardProps = {
  id: number;
  isMatched: boolean;
  isSelected: boolean;
  text: string;
};

export type ContextType = {
  selectedCards: CardProps[];
  removeFromList: (text: string) => void;
  shuffle: (
    callback: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => void;
  cards: JSX.Element[];
  setIsSelected: (
    id: number,
    text: string,
    setData: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  ) => void;
  refresh: () => void;
};

export const GameContext = React.createContext<ContextType>({
  selectedCards: [],
  removeFromList: () => undefined,
  shuffle: () => undefined,
  cards: [],
  setIsSelected: () => undefined,
  refresh: () => undefined,
});

const emojis = emojisList();

const cardsPropsList = () =>
  emojis.concat(emojis).map((text, index) => ({
    id: index,
    isMatched: false,
    isSelected: false,
    text,
  }));

const GameContextComponent: React.FC = ({ children }) => {
  const [refresh, setRefresh] = useState<number>();
  const [cardsProps, setCardsProps] = useState<CardProps[]>();
  const [selectedCards, setSelectedCards] = useState<CardProps[]>([]);

  const handleRefresh = () => {
    setRefresh(1);
  };

  const [cards, setCards] = useState<JSX.Element[]>();

  const getCardComponent = (cardProps: CardProps) => (
    <View key={cardProps.id.toString()} style={{ padding: 1 }}>
      <Card
        id={cardProps.id}
        text={cardProps.text}
        isSelected={cardProps.isSelected}
        isMatched={cardProps.isMatched}
      />
    </View>
  );

  const getCardComponentList = (cardsProps: CardProps[]) =>
    cardsProps.map((cardProps) => getCardComponent(cardProps));

  useEffect(() => {
    const props = cardsPropsList();
    setCardsProps(props);
    setCards(getCardComponentList(props));
  }, []);

  useEffect(() => {
    if (refresh !== undefined) {
      setSelectedCards([]);
      setCardsProps(undefined);
      setCards(undefined);
    }
  }, [refresh]);

  useEffect(() => {
    if (refresh !== undefined && !cardsProps && !cards?.length) {
      const props = cardsPropsList();
      setRefresh(undefined);
      setCards(getCardComponentList(props));
      setCardsProps(props);
    }
  }, [cardsProps]);

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
        shuffledCards[cardIndex] = getCardComponent(cardProps);
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

  const handleSelectCard = (card: CardProps) => {
    setSelectedCards((v) => [...v, card]);
  };

  const hasPair = (id: number, text: string) => {
    return selectedCards.filter((v) => v.text === text);
  };

  const removeFromList = (text: string) =>
    setSelectedCards(selectedCards.filter((t) => t.text !== text));

  return (
    <GameContext.Provider
      value={{
        selectedCards,
        removeFromList,
        shuffle,
        cards: cards || [],
        setIsSelected,
        refresh: handleRefresh,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextComponent;
