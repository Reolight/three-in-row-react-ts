import React from 'react';
import './App.css';
import Game from './components/Game';
import Player from './logic/Player';

function App() {
  return (
    <div className="App">
      <Game stage="test2" player={{name: "Reolight", money: 0}} />
    </div>
  );
}

export default App;
