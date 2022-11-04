import React, { useEffect, useState } from "react";
import Cell from "../logic/Cell";
import Goal from "../logic/interfaces/Goal";
import Player from "../logic/Player";

interface UITableProps {
    player: Player
    goal: Goal
}

export default function UITable(props: UITableProps){
    const [player, setPlayer] = useState(props.player)

    function onChanged(){
        setPlayer(player)
    }

    useEffect(onChanged, [props.player])

    return(
        <div className="flex flex-row">
            <p><>Name: {props.player.name} Money: {props.player.money}.</></p>
            <em><b>Step: </b>{player.score?.step} Score: {player.score?.score}</em>
            <em>{player.score!.destroyed.map((kv) => 
                <>
                    <img key={kv.name} className="Icon" src={Cell.getSpriteByName(kv.name)}/>
                    {kv.value}
                </>)}
            </em>
            <p><b>Goal:</b> {props.goal.toString()} 
                {props.goal.isDefeated(props.player.score!)? <em><b>(LOST)</b></em> : props.goal.isAchieved(props.player.score!) && <em><b>(STAGE COMPLETED)</b></em>}
            </p>
        </div>
    )
}