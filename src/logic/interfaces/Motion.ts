import { AnimationProps, Variants } from "framer-motion"
import Cell from "../Cell"
import {Position} from "./Position"

export default interface Motion{
    id? : number
    image: string
    width: number
    height: number
    position?: Position
    anim: Variants
}

export function cloneMotion(motion: Motion) : Motion {
    return {
        anim: {initial: motion.anim.initial, transition: motion.anim.transition, animate: motion.anim.animate},
        width: motion.width,
        height: motion.height,
        image: motion.image
    } as Motion
}

export function retrieveMotionImage(file_name: string): string {
    let file : string
    try { file = require(`../../sources/data/levels/${Cell.field.name}/${file_name}`)}
    catch { file = require(`../../sources/motions/${file_name}`) }
    return file
}