import React from 'react';

import GameContextComponent from './src/GameContext';
import Table from './src/components/Table';

export default function App() {
  return (
    <GameContextComponent>
      <Table />
    </GameContextComponent>
  );
}
