import React, { useState } from "react";
import Table from "./Table"

interface gameInfoProps{
    stage: string
    
}

export default function Game(props : gameInfoProps){
    
    return(        
        (<div className="Game-container">
            <h1>Table</h1>
            <Table stage={props.stage}/>
        </div>)
    )
}