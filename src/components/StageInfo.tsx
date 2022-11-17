import React from "react";
import PlayRecord from "../logic/interfaces/PlayRecord";
import { retrieveStageByTitle } from "../sources/data/Scenes";
import { getSpriteByName } from "../sources/data/Sprites";

interface StageInfoProps{
    name?: string
    record?: PlayRecord
    callback: (nameStage: string) => void; //callback
}

export default function StageInfo(props: StageInfoProps){
    const stage = retrieveStageByTitle(props.name!) ?? undefined
    
    return( !stage ? <div className="Panel-inactive"></div> :
        <div className="Panel animatedV Menu-column w-50">
            <h1>{stage.title}</h1>
            <p>{stage.description}</p>
            <p><b>Goal:</b> {stage.goal.toString()}</p>
            {props.record && <p>Passed: score  {props.record.score}</p> }
            <em>
                field size: {stage.x}x{stage.y}. 
                Tiles: {stage.allowedSpites.map((sprite, index) => 
                    <img key={index} className="Icon" src={getSpriteByName(sprite)} alt={sprite} />
                )}
            </em>
            <button
                className="w-fit-content"
                onClick={() => props.callback(stage.name!)} 
            >
                    Start
            </button>
        </div>
    )
}