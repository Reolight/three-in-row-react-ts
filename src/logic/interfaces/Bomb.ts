import { AnimationProps } from "framer-motion"
import Cell from "../Cell"
import Field from "../Field"
import Motion from "./Motion"
import Position from "./Position"

/**
 * Presents at the field until it is destroyed. When destroyed, releases action as field-modifying function and motion as animation
 */

export default abstract class Bomb{
    name: string = ""
    orientation?: 'h' | 'v' | 'n'
    animation: Motion[] = []
    image?: string

    action(field: Field, position: Position): void{
        return
    }
}