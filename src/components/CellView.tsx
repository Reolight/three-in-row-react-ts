import React, { useEffect, useRef, useState } from "react";
import Cell from "../logic/Cell";
import Position from "../logic/interfaces/Position";
import "./styles/anims.css"
import { motion } from "framer-motion"
import Sprite from "../logic/Sprite";

interface CellProps{
    sprite: Sprite
    clicked: (pos: Position) => void
    selected: boolean
}

export default function CellView(props: CellProps){
    const [sprite, setSprite] = useState(props.sprite)
    
    return(
        <>
                {sprite && <>
                    <motion.div
                        animate={{
                            x: sprite.position.x * 64,
                            y: sprite.position.y * 64
                        }}
                        initial={{
                            x: sprite.position.x * 64,
                            y: sprite.position.y * 64
                        }}
                    >
                        <img
                            className={props.selected? "Item-selected" : "Item"} 
                            
                            src={Cell.getSprite(sprite)}
                            alt={sprite.name} 
                            onClick={() => props.clicked(sprite.position)}
                        />
                    </motion.div> 
                </>}
                
        </>
    )
}