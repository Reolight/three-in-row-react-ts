import { motion } from "framer-motion";
import Animator from "./Animator";
import Cell from "./Cell";
import Field from "./Field";
import Effect from "./interfaces/Effect";
import Motion from "./interfaces/Motion";
import Position from "./interfaces/Position";

export default class Effector{
    static Effects: Effect[] = []
    static count: number = 0

    private static raiseMotion(motion: Motion | undefined, pos: Position){
        if (motion){
            Animator.perform(motion, pos)
        }
    }

    static spawn(field: Field, effect: Effect, cell: Cell){
        let e = effect
        e.id = Effector.count++
        console.warn(e)
        try{
            const motions = e.onSpawn(field)
            motions?.forEach(motions => Effector.raiseMotion(motions, cell.pos))
        } catch{}

        console.debug(`../../sources/effect/${e.image}`)
        e.image = e.image? require(`../sources/effect/` + e.image) : ""
        Effector.Effects.push(e)
    }

    static onFree(f: Field, p: Position){
        Effector.Effects.forEach(eff => {
            try{
                const motions = eff.onFree(f)
                motions?.forEach(motion => Effector.raiseMotion(motion, p))
            } catch{}
        })
    }

    static destroy(f: Field, p: Position, id: number){
        const index = Effector.Effects.findIndex(e => e.id === id)
        if (index > -1 ){
            try{
                const motions = Effector.Effects[index].onDestroy(f, p)
                motions?.forEach(motion => Effector.raiseMotion(motion, p))
            } catch{}

            Effector.Effects.splice(index, 1)
        }
    }
}