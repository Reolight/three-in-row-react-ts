import React, { useContext, useEffect } from "react";
import { PlayerContext } from "../App";
import Cell from "../logic/Cell";
import Goal from "../logic/interfaces/Goal";
import "./styles/panel.css"

interface UITableProps {
    goal: Goal
}

export default function UITable(props: UITableProps){
    const {player, setPlayer} = useContext(PlayerContext)

    function onChanged(){
        setPlayer(player)
    }

    useEffect(onChanged, [player!])

    return(
        <div className="Panel-dark sidebar">
            <p>Name: {player!.name} Money: {player!.money}.</p>
            <p><em><b>Step: </b>{player!.score?.step}</em></p>
            <p><em><b>Score:</b> {player!.score?.score}</em></p>
            <p><em>{player!.score!.destroyed.map((kv) => 
                <>
                    <img key={kv.name} className="Icon" src={Cell.getSpriteByName(kv.name)}/>
                    {kv.value}
                </>)}
            </em></p>
            <p><b>Goal:</b> {props.goal.toString()} 
                {props.goal.isDefeated(player!.score!)? <em><b>(LOST)</b></em> : props.goal.isAchieved(player!.score!) && <em><b>(STAGE COMPLETED)</b></em>}
            </p>
        </div>
    )
}