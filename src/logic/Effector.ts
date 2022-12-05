import Loader from "../sources/data/Loader";
import Animator from "./Animator";
import Cell from "./Cell";
import Field from "./Field";
import Effect from "./interfaces/Effect";
import Motion from "./interfaces/Motion";
import {Position} from "./interfaces/Position";

export default class Effector{
    static Effects: Effect[] = []
    static count: number = 0

    static raiseMotion(field: Field, motion: Motion | undefined, pos: Position){
        if (motion){
            Animator.perform(field, motion, pos)
        }
    }

    static spawn(field: Field, effect: Effect, cell: Cell){
        let e = effect
        e.id = Effector.count++
        if (cell.sprite.effect && cell.sprite.effect.active) Effector.destroy(field, cell.pos, cell.sprite.id)
        console.warn(e)
        try{
            const motions = e.onSpawn(field)
            motions?.forEach(motions => Effector.raiseMotion(field, motions, cell.pos))
        } catch{}

        if (e.image) e.image = Loader.getEffect(field.name, e.image)!

        cell.sprite.effect = effect
        cell.unmarkFromDelete()
        Effector.Effects.push(e)
    }

    static onFree(f: Field, p: Position){
        Effector.Effects.forEach(eff => {
            if (eff.active) {
                try{
                    const motions = eff.onFree(f)
                    motions?.forEach(motion => Effector.raiseMotion(f, motion, p))
                } catch{}
            }
        })
    }

    static destroy(f: Field, p: Position, id: number){
        const index = Effector.Effects.findIndex(e => e.id === id)
        if (index > -1 && Effector.Effects[index].active) {
            try{
                const motions = Effector.Effects[index].onDestroy(f, p)
                motions?.forEach(motion => Effector.raiseMotion(f, motion, p))
            } catch{}

            Effector.Effects.splice(index, 1)
            f.cells[p.y][p.x].sprite.effect = {} as Effect //empty effect after destroy to make sure it won't be called twice+!
        }
    }
}