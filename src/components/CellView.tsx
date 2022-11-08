import React, { useEffect, useRef, useState } from "react";
import Cell from "../logic/Cell";
import Position from "../logic/interfaces/Position";
import "./styles/anims.css"

interface CellProps{
    cell: Cell
    clicked: (pos: Position) => void
    selected: boolean
}

export default function CellView(props: CellProps){
    const [c, setCell] = useState(props.cell)
    const image = useRef<HTMLImageElement>(null)

    useEffect(() => {
        console.warn(`EFFECT: dropped = ${props.cell.dropped}`)
        if (props.cell.dropped != 2){
            switch (props.cell.dropped){
                case 1:
                    console.warn("dropped to fow left")
                    image.current?.classList.add('drop-fl')
                    break
                case 0:
                    console.warn("dropped to fow")
                    image.current?.classList.add('drop-f')
                    break
                case -1:
                    console.warn("dropped to fow right")
                    image.current?.classList.add('drop-fr')
                    break
                default:
                    console.warn("?????")
                    break
            }
        } else {
            if (image.current?.classList.contains('drop-fl')){
                image.current.classList.remove('drop-fl')
            } else if (image.current?.classList.contains('drop-f')){
                image.current.classList.remove('drop-f')
            } else if (image.current?.classList.contains('drop-fr')){
                image.current.classList.remove('drop-fr')
            }
        }
    }, [props.cell.dropped < 2])

    return(
        <>
                {!c.isEmpty() && 
                        <img
                            ref={image}
                            className={props.selected? "Item-selected" : "Item"} 
                            src={Cell.getSprite(c.sprite)}
                            alt={c.sprite.name} 
                            onClick={() => props.clicked(c.pos)}
                        />
                }
                
        </>
    )
}