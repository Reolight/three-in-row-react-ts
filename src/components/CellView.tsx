import React, { useState } from "react";
import Cell from "../logic/Cell";

interface CellProps{
    cell: Cell
}

export default function CellView(props: CellProps){
    const [c, setCell] = useState(props.cell)

    return(
        <>
            {!c.isEmpty() && <img className="cell" src={c.getSprite()} alt={c.sprite.name} />}
        </>
    )
}