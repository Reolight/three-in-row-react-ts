import { title } from "process";
import Goal from "../../../../logic/interfaces/Goal";
import { FieldParams } from "../../Scenes";

export default class gensh implements FieldParams{
    name: string = "gensh"
    title: string = "Musical stage"
    x: number = 9
    y: number = 9
    allowedSprites: string[] = ['anime', 'cryo', 'dendro', 'electro', 'geo', 'hydro', 'pyro']
    goal: Goal = {
        isAchieved(score): boolean{ return score!.score > 5000 },
        isDefeated(score): boolean{ return score!.step > 40},
        toString(): string {
            return "score more than 5000 less then 40 steps"
        },
    } as Goal

    constructor () {}
}