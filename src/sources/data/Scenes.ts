import { cell_definition } from "../../logic/auxillary/LevelReader";
import { level_unlock_conditions } from "../../logic/interfaces/Conditions";
import Goal from "../../logic/interfaces/Goal";
import gensh from "./levels/gensh/gensh";

export interface FieldParams{
    title: string
    name: string
    description?: string
    x: number
    y: number
    allowedSprites: string[]

    definitions?: cell_definition[]
    stringified_field?: string[]

    music?: string
    wallpaper?: string

    level_conditions?: level_unlock_conditions
    goal: Goal
}

const scenes : FieldParams[] =
    [        
        {
            title: "Square",
            name: "square",
            wallpaper: "back.bmp",
            x: 8,
            y: 8,
            allowedSprites: ["square", "circle", "rumb", "triangle"],
            goal: {
                isAchieved(score) {
                    return score.score > 350
                },
                isDefeated(score) {
                    return score.step > 30
                },
                toString() {
                    return "This stage demonstrates default background of tiles, simple test tiles. Field has simple " +
                        "square shape. Try to get 350 score for less then 30 steps"
                },
            }

        },
        {
            title: "Wheel",
            name: "wheel",
            x: 8,
            y: 8,
            allowedSprites: ['pyro', 'hydro', 'cryo', 'anime', 'electro'],
            goal: {
                isAchieved(score): boolean{ return score!.score > 250 },
                isDefeated(score): boolean{ return score!.step > 33},
                toString():string {return "This stage has custom shape with demonstration of advanced falling rules."+
                    ". There are also custom tile backgrounds and fancy items. Score more than 250 for less than 33 steps"},
            },

            definitions: [{key: "d", tile: {isBlocked: false, isExist: true, isFrozen: false, image: "grey_tile.png"}},
                          {key: "b", tile: {isBlocked: true, isExist: true, isFrozen: false, image: "grey_blocked.png"}}],
            stringified_field: ["--dddd--",
                                "-dddddd-",
                                "dddddddd",
                                "dddbbddd",
                                "dddbbddd",
                                "dddddddd",
                                "-dddddd-",
                                "--dddd--"]
        },
        {
            title: "Collectables",
            name: "collect",
            x: 8,
            y: 8,
            allowedSprites: ["square", "circle", "rumb", "triangle", "diamond_c"],
            goal: {
                isAchieved(score): boolean{ return score!.destroyed.find(d => d.name === "diamond_c")!.value === 5 },
                isDefeated(score): boolean{ return score!.step > 30},
                toString():string {return "This stage shows implemented collection feature. There is also field "+
                 "with custom shape. Collect 5 diamonds for less than 30 steps by moving diamonds to the last row"},
            },

            definitions: [{key: "d", tile: {isBlocked: false, isExist: true, isFrozen: false, image: "grey_tile.png"}}],
            stringified_field: ["--dddd--",
                                "-dddddd-",
                                "dddddddd",
                                "dd-dd-dd",
                                "dd-dd-dd",
                                "dddddddd",
                                "-dddddd-",
                                "dddddddd"]
        },
        new gensh
    ]

export default function retrieveStage(name: string): FieldParams | undefined {
    return scenes.find(sc => sc.name === name)
}

export function retrieveStageByTitle(title: string): FieldParams | undefined {
    return scenes.find(sc => sc.title === title)
}

export function getStageNames(): string[]{
    let stages : string[] = []
    scenes.forEach(scene => stages.push(scene.name))
    return stages
}

export function getStageTitles(): FieldParams[]{
    let stages : FieldParams[] = []
    scenes.forEach(scene => stages.push(scene))
    return stages
}