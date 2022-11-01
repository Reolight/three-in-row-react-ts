import React, { useState } from "react";
import Cell from "../logic/Cell";

interface CellProps{
    cell: Cell
}

export default function CellView(props: CellProps){
    const [c, setCell] = useState(props.cell)

    return(
        <img src={c.getBackground(false)} alt="">
            {!c.isEmpty() && <img src={c.getSprite()} alt={c.sprite.name}></img>}
        </img>
    )
}