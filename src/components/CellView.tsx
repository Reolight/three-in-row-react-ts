import React, { useState } from "react";
import Cell from "../logic/Cell";
import Position from "../logic/interfaces/Position";

interface CellProps{
    cell: Cell
    clicked: (pos: Position) => void
    selected: boolean
}

export default function CellView(props: CellProps){
    const [c, setCell] = useState(props.cell)

    return(
        <>
            {!c.isEmpty() && <img
                className={props.selected? "Item-selected" : "Item"} 
                src={Cell.getSprite(c.sprite)}
                alt={c.sprite.name} 
                onClick={() => props.clicked(c.pos)}
            />}
        </>
    )
}