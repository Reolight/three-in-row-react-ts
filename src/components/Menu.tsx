import React, { useContext, useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { PlayerContext } from "../App";
import Player from "../logic/Player";
import { FieldParams, getStageTitles } from "../sources/data/Scenes";
import StageInfo from "./StageInfo";
import "./styles/panel.css"

export default function Menu(){
    const params = useParams()
    const {player, setPlayer} = useContext(PlayerContext)

    const stages: FieldParams[] = getStageTitles()
    const [chosen, setChosen] = useState<number>(-1)
    const [width, setWidth] = useState<number>(500)
    const [stageH, setStageH] = useState<number>(0)
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

        console.debug(player)
    }, [params])

    return(!player? <p>Loading</p>:
        <div style={{position: 'relative'}}>
            <div className="Panel" >
                <div className="Menu-column">
                    <h3 style={{ marginBottom: 0 }}><b>{player!.name}</b></h3>
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
                                <p><>{index + 1}: {stage.title}</></p>
                            </button>
                        )})}
                    </div>
                </div>

                <div className="flex">
                    {stages[chosen] && <StageInfo
                        width={width}
                        name={stages[chosen].title}
                        callback={launchGame}
                        record={player!.getRecord(stages[chosen].name)}
                    />}
                </div>
            </div>
        </div>
    )
}