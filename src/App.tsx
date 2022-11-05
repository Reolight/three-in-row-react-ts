import React, { createContext, Dispatch, SetStateAction } from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Route, Routes} from 'react-router-dom'
import Player from './logic/Player';

type TypeSetState<T> = Dispatch<SetStateAction<T>>

interface IContext{
  player: Player | undefined
  setPlayer: TypeSetState<Player | undefined>
}

export const PlayerContext = createContext<IContext>({} as IContext)

function App() {
  const [player, setPlayer] = React.useState<Player>()

  return(
    <PlayerContext.Provider value={{player, setPlayer}}>
      <Routes>
        {AppRoutes.map((route, index) => {
          const {element, ...rest} = route
          return <Route key={index} {...rest} element={element} />
        })}
      </Routes>
    </PlayerContext.Provider>
  )

  //return (
//    <div className="App">
  //    <Game stage="test2" player={new Player("Reolight", 0)} />
    //</div>
  //);
}

export default App;
