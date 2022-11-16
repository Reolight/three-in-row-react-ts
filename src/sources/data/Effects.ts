import { AnimationProps, Variants } from "framer-motion";
import Cell from "../../logic/Cell";
import Field from "../../logic/Field";
import Bomb from "../../logic/interfaces/Bomb";
import Effect from "../../logic/interfaces/Effect";
import Motion from "../../logic/interfaces/Motion";
import Position from "../../logic/interfaces/Position";
import { effect_conditions } from "../../logic/interfaces/Conditions";

/**
 * DO NOT USE THIS FUNCTION DIRECTLY! Instead of direct use, conditions should be specified.
 * Retrieves effect from "storage" by deep cloning the template.
 * @param name - name of raised effect
 * @returns 
 */

export default function getEffect(name: string): Effect | undefined {
    const eff = effects.find(b => b.name === name)
    if (!eff) return
    const clone = require("rfdc/default")
    return clone(eff) as Effect
}

const effects: Effect[] = [
    {
        name : "sprite",
        duration: -1,
        active: true,
        image: "row.png",
                
        onDestroy(field: Field, position: Position) {
            let row : Cell[] = []
            if (this.orientation === 'v'){
                for (let i = 0; i < field.cells[0].length; i++){
                    row.push(field.cells[i][position.x])
                }
            } else {
                row = field.cells[position.y]
            }

            row.forEach(cell => cell.markForDelete())

            return [
                {
                    height: 64,
                    width: 84,
                    image: "sprite.png",
                    anim: {
                        animate: {
                            x: this.orientation === 'h'? 0 : position.x * Field.Cell_size,
                            y: this.orientation === 'h'? position.y * Field.Cell_size : 0
                        },
                        initial: {
                            rotate: this.orientation === 'v'? 90: 0,
                            x: position.x * Field.Cell_size,
                            y: position.y * Field.Cell_size
                        },
                        transition: {
                            duration: 0.3
                        }
                    }
                },
                {
                    height: 64,
                    width: 84,
                    image: "sprite.png",
                    anim: {
                        animate: {
                            x: this.orientation === 'h'?
                                field.cells[0].length * Field.Cell_size
                                : position.x * Field.Cell_size,
                            y: this.orientation === 'h' ? position.y * Field.Cell_size
                                : field.cells.length * Field.Cell_size
                        },
                        initial: {
                            rotate: this.orientation === 'h' ? 180 : 270,
                            x: position.x * Field.Cell_size,
                            y: position.y * Field.Cell_size
                        },
                        transition: {
                            duration: 0.3
                        }
                    } as Variants
                }
            ]
        }
    } as Effect,

    {
        name: "bomb",
        image: "block.png",
        active: true,
        duration: -1,
        
        onDestroy(field: Field, position: Position) {
            for (let i = -1; i <= 1; i++){
                for (let j = -1; j <= 1; j++){
                    if (field.cells[position.y + i][position.x + j])
                        field.cells[position.y + i][position.x + j].markForDelete()
                }
            }

            return [{
                image: "bomb.png",
                width: 256,
                height: 256,
                anim: {
                    animate: {
                        opacity: 0.25,
                        scale: 1.25
                    },
                    initial:{
                        x: position.x * Field.Cell_size - 128,
                        y: position.y * Field.Cell_size - 128,
                        opacity: 1.0,
                        scale: 0.01
                    },
                    transition:{duration: 0.4}
                }
            } as Motion]
        }
    } as Effect
]