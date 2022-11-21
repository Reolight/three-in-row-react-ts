import React, { useEffect, useRef, useState } from "react";
import {Position} from "../logic/interfaces/Position";
import "./styles/anims.css"
import { motion } from "framer-motion"
import Sprite from "../logic/Sprite";
import Field from "../logic/Field";

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
                        onClick={() => props.clicked(sprite.position)}
                        animate={{
                            x: sprite.position.x * Field.Cell_size,
                            y: sprite.position.y * Field.Cell_size,
                            opacity: 1
                        }}
                        initial={{
                            x: sprite.position.x * Field.Cell_size,
                            y: sprite.position.y * Field.Cell_size,
                            opacity: 0
                        }}
                    >
                        <img
                            className={props.selected? "Item-selected" : "Item"} 
                            style={{
                                width: Field.Cell_size,
                                height: Field.Cell_size
                            }}
                            src={sprite.sprite}
                            alt={sprite.name}
                        />
                        {sprite.effect && 
                                <motion.img
                                    key={sprite.effect.id}
                                    animate={{scale: 1}}
                                    initial={{scale: 0}}
                                    src={sprite.effect.image}
                                    alt={sprite.effect.name}
                                    style={{
                                        position: 'absolute',
                                        rotate: sprite.effect.orientation === 'v'? '90deg' : 'none',
                                        width: Field.Cell_size,
                                        height: Field.Cell_size,
                                        zIndex: 5000
                                    }}
                                />}
                    </motion.div> 
                </>}
                
        </>
    )
}