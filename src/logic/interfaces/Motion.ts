import { Variants } from "framer-motion"
import {Position} from "./Position"

export default interface Motion{
    id? : number
    image: string
    width: number
    height: number
    position?: Position
    anim: Variants
}