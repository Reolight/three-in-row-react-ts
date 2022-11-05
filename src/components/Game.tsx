import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlayerContext } from "../App";
import Player from "../logic/Player";
import Score from "../logic/Score";
import ResultScreen from "./ResultScreen";
import Table from "./Table"

interface gameInfoProps{
    stage: string
    player: Player
}

export default function Game(props : gameInfoProps){
    const navigate = useNavigate()
    const params = useParams()
    
    const {player, setPlayer } = useContext(PlayerContext)
    const [isCompleted, setCompleted] = useState<"WON" | "LOST" | "PLAY">("PLAY")
    
    const stage = props.stage ?? params.stage
    
    function Won(){
        player!.recordPlay(stage, player!.score!.score)
        setCompleted("WON")
    }

    function Completed(isWon: boolean): void {
        setPlayer(player!)
        if (isWon) Won()
        else setCompleted("LOST")
    }

    function retry(){
        player!.money -= Math.round(player!.score!.score / 4 * 3)
        setPlayer(player)
        window.location.reload()
    }

    function toMenu(){
        player!.score! = {} as Score
        setPlayer(player)
        navigate(-1)
    }

    return(
    <div>
        <Table stage={stage} stage_complete_callback={Completed}/>
        {isCompleted !== "PLAY" && 
            <ResultScreen 
                isWon={isCompleted === "WON"} 
                score={player!.score!}
                menu={toMenu}
                retry={retry} 
            />
        }
            
    </div>)
}