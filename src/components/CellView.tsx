import React, { useEffect, useRef, useState } from "react";
import Cell from "../logic/Cell";
import Position from "../logic/interfaces/Position";
import "./styles/anims.css"
import { motion } from "framer-motion"

interface CellProps{
    cell: Cell
    clicked: (pos: Position) => void
    selected: boolean
}

export default function CellView(props: CellProps){
    const [c, setCell] = useState(props.cell)

    return(
        <>
                {!c.isEmpty() && 
                    <motion.div
                        animate={{x: []}}
                    >
                        <img
                            className={props.selected? "Item-selected" : "Item"} 
                            src={Cell.getSprite(c.sprite)}
                            alt={c.sprite.name} 
                            onClick={() => props.clicked(c.pos)}
                        />
                    </motion.div>
                }
                
        </>
    )
}