import React, { useState } from "react";
import Cell from "../logic/Cell";
import Position from "../logic/interfaces/Position";

interface CellProps{
    cell: Cell
    clicked: (pos: Position) => void
}

export default function CellView(props: CellProps){
    const [c, setCell] = useState(props.cell)

    return(
        <>
            {!c.isEmpty() && <img
                className="cell"
                src={c.getSprite()}
                alt={c.sprite.name} 
                onClick={() => props.clicked(c.pos)}
            />}
        </>
    )
}