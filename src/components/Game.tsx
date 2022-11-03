import React, { useState } from "react";
import Player from "../logic/Player";
import Table from "./Table"
import UITable from "./UITable";

interface gameInfoProps{
    stage: string
    player: Player
}

export default function Game(props : gameInfoProps){
    
    return(        
        (<>
            <div>
                <Table stage={props.stage} player={props.player}/>
            </div>
        </>)
    )
}