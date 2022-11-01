import React from 'react';
import logo from './logo.svg';
import './App.css';
import Field from './logic/Field';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <Game stage="test stage" />
    </div>
  );
}

export default App;
