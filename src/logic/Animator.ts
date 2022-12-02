import Loader from "../sources/data/Loader";
import Field from "./Field";
import Motion from "./interfaces/Motion";
import {Position} from "./interfaces/Position";

export default class Animator{
    static Animations: Motion[] = []
    static count: number = 0
    /**
     * Puts an animation in the performing list
     * @param animation
     */
    static perform(field: Field, animation: Motion, pos: Position){
        const a : Motion = animation
        a.id = Animator.count++
        a.image = Loader.getMotion(field.name, a.image)!
        a.position = {x: pos.x, y: pos.y}

        console.debug(`Animation to be performed: `, a)
        //Animator.Animations.push(a)
        field.animations.push(a)
    }

    static remove(field: Field, id: number){
        const anim_i = Animator.Animations.findIndex(a => a.id === id)
        if (anim_i >= 0){
            //Animator.Animations.splice(anim_i, 1)
            field.animations.splice(anim_i, 1)
        } else console.warn(`Animation with id ${id} have been already removed`)
    }
}