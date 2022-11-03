import React, { useState } from "react";
import Player from "../logic/Player";
import Table from "./Table"

interface gameInfoProps{
    stage: string
    player: Player
}

export default function Game(props : gameInfoProps){
    
    return(
    <div>
        <Table stage={props.stage} player={props.player}/>
    </div>)
}