import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Route, Routes} from 'react-router-dom'
import Game from './components/Game';
import Player from './logic/Player';

function App() {
  return(
    <Routes>
      {AppRoutes.map((route, index) => {
        const {element, ...rest} = route
        return <Route key={index} {...rest} element={element} />
      })}
    </Routes>
  )

  //return (
//    <div className="App">
  //    <Game stage="test2" player={new Player("Reolight", 0)} />
    //</div>
  //);
}

export default App;
