import React, { useEffect, useState } from "react";
import Player from "../logic/Player";

interface UITableProps {
    player: Player
}

export default function UITable(props: UITableProps){
    const [money, setMoney] = useState(props.player.money)

    function moneyChanged(){
        setMoney(money)
    }

    useEffect(moneyChanged, [props.player])

    return(
        <div>
            <p><>Name: {props.player.name}</></p>
            <em><>Money: {props.player.money}</></em>
        </div>
    )
}