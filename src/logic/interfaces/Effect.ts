import { AnimationProps } from "framer-motion"
import Field from "../Field"
import { Orientation } from "./Conditions"
import Motion from "./Motion"
import Position from "./Position"

/**
 * Used as template for creating custom effects
 * 
 * @param name - Name
 * @param duration how long lasts (-1 - has no expiration steps)
 * @param motion - animation which
 * @param image - represents effect at field
 * 
 * @param onFree - fires action each turn if @param active true
 * @param onSpawn - for effect initialization
 * @param onDestroy - must revert some actions (like cell blocking)
 */
export default class Effect {
    id?: number
    name: string = ""
    duration: number
    active: boolean
    animation?: Motion[] = []
    image: string
    position?: Position

    orientation?: Orientation
    
    constructor(e : Effect){
        this.name = e.name
        this.duration = e.duration
        this.active = e.active
        this.image = e.image
        this.position = e.position
        e.animation?.forEach(an => this.animation?.push(an))
    }

    onFree(field: Field) : Motion[] | undefined{
        return
    }

    onSpawn(field: Field): Motion[] | undefined {
        return
    }

    onDestroy(field: Field, position: Position): Motion[] | undefined{
        return
    }
}