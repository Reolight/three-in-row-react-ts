import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlayerData from "../logic/interfaces/PlayerData";
import PlayRecord from "../logic/interfaces/PlayRecord";
import Player from "../logic/Player";
import ResultScreen from "./ResultScreen";
import Table from "./Table"

interface gameInfoProps{
    stage: string
    player: Player
}

export default function Game(props : gameInfoProps){
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
    const [isCompleted, setCompleted] = useState<"WON" | "LOST" | "PLAY">("PLAY")
    const [player, setPlayer] = useState(props.player ?? Player.makePlayer(location.state.player as PlayerData))
    
    const stage = props.stage ?? params.stage

    function Won(){
        player.recordPlay(stage, player.score!.score)
        setCompleted("WON")
    }

    function Completed(isWon: boolean, player: Player): void {
        setPlayer(player)
        if (isWon) Won()
        else setCompleted("LOST")
    }

    function retry(){
        
    }

    const [state, setState] = useState()

    return(
    <div>
        <Table stage={stage} player={player} stage_complete_callback={Completed}/>
        {isCompleted !== "PLAY" && <ResultScreen isWon={isCompleted === "WON"} score={player.score!} /> }
            
    </div>)
}