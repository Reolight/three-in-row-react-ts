import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Player from "../logic/Player";
import Table from "./Table"

interface gameInfoProps{
    stage: string
    player: Player
}

export default function Game(props : gameInfoProps){
    const player = props.player ?? new Player("Reolight", 0)
    const params = useParams();
    const stage = props.stage ?? params.stage
    return(
    <div>
        <Table stage={stage} player={player}/>
    </div>)
}