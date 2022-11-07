import React, { useContext, useEffect, useState } from "react";
import { redirect, useLocation, useNavigate, useParams } from "react-router-dom";
import { PlayerContext } from "../App";
import Player from "../logic/Player";
import { getStageTitles } from "../sources/data/Scenes";
import StageInfo from "./StageInfo";
import "./styles/panel.css"

export default function Menu(){
    const params = useParams()
    const {player, setPlayer} = useContext(PlayerContext)

    const stages: string[] = getStageTitles()
    const [chosen, setChosen] = useState<number>(-1)
    const navigate = useNavigate()

    function launchGame(stage: string){
        navigate(`../Game/${stage}&${player!.name}`)
    }

    useEffect(()=>{   //in case of reload set player to those, who's name is in Url
        if (!player){
            let player_name: string | undefined = params.player
            if (!player_name || player_name.length < 4) {
                redirect("/")
                return
            }

            setPlayer(Player.load(player_name))
        }
    }, [params])

    return(!player? <p>Loading</p>:
        <>
        <div className="Panel">
            <div className="Menu-column">
                <h3><b>{player!.name}</b></h3>
                <p>Money: ${player!.money}</p>
            </div>
        </div>

        <div className="flex-row">
            <div className="App Panel flex-column">
                <h1>Stage menu</h1>
                <h3>Choose stage to continue</h3>
                <div className="flex-column List-div">
                    {stages.map((stage, index)=>{ return(
                        <button
                            className="w-100"
                            key={index}
                            onClick={() => chosen == index? setChosen(-1): setChosen(index)}
                        >
                            <p>{index + 1}: {stage}</p>
                        </button>
                    )})}
                </div>
            </div>
            <div className="flex">
                <StageInfo 
                    name={stages[chosen]}
                    callback={launchGame}
                    record={player!.getRecord(stages[chosen])}
                />
            </div>
        </div>
        </>
    )
}