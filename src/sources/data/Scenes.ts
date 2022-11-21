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
            title: "Test stage",
            name: "test_stage",
            description: "This stage is designed for testing game capabilities",
            x: 8,
            y: 8, 
            allowedSprites: ["diamond", "gold", "iron"], 
            goal: { toString(): string {return "no goals"}, isAchieved: () => false, isDefeated: () => false }
        },
        {
            title: "Test stage 2",
            name: "test2",
            x:16,
            y:12,
            allowedSprites: ["square", "circle", "rumb", "triangle"],
            goal: {
                isAchieved(score): boolean{ return score!.score > 1000 },
                isDefeated(score): boolean{ return score!.step > 20},
                toString(): string {
                    return "score more than 1000 less then 20 steps"
                },
        } as Goal
        },
        {
            title: "Tiny",
            name: "tiny",
            x:4,
            y:4,
            allowedSprites:["diamond", "gold", "iron"], 
            goal: { toString(): string {return "no goals"}, isAchieved: () => false, isDefeated: () => false }
        },
        
        {
            title: "My custom stage",
            name: "custom",
            x: 8,
            y: 8,
            allowedSprites: ["square", "circle", "rumb", "triangle"],
            goal: {
                isAchieved(score): boolean{ return score!.score > 2000 },
                isDefeated(score): boolean{ return score!.step > 25},
                toString():string {return "score more than 2000 and less than 25 steps"},
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
                toString():string {return "collect 5 diamonds for less than 30 steps"},
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
        }
    ]

export default function retrieveStage(name: string): FieldParams | undefined {
    return scenes.find(sc => sc.name == name)
}

export function retrieveStageByTitle(title: string): FieldParams | undefined {
    return scenes.find(sc => sc.title == title)
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