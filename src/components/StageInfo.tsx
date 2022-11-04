import React from "react";
import { Link } from "react-router-dom";
import Cell from "../logic/Cell";
import retrieveStage from "../sources/data/Scenes";

interface StageInfoProps{
    name?: string
}

export default function StageInfo(props: StageInfoProps){
    const stage = retrieveStage(props.name!) ?? undefined

    return( !stage ? <div className="Panel-inactive"></div> :
        <div className="Panel List-div">
            <h1>{stage.name}</h1>
            <p>{stage.description}</p>
            <em>
                field size: {stage.x}x{stage.y}. 
                Tiles: {stage.allowedSpites.map((sprite, index) => 
                    <img key={index} className="Icon" src={Cell.getSpriteByName(sprite)} />
                )}
            </em>

            <p><b>Goal:</b> {stage.goal.toString()}</p>
            <Link className="Panel-button" to={`Game/${stage.name}`} >
                    Start
            </Link>
        </div>
    )
}