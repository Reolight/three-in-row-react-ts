import Goal from "../../logic/interfaces/Goal";

interface FieldParams{
    name: string
    description?: string
    x: number
    y: number
    allowedSpites: string[]
    goal: Goal
}

const scenes : FieldParams[] =
    [
        {
            name: "test stage",
            description: "This stage is designed for testing game capabilities",
            x: 8,
            y: 8, 
            allowedSpites: ["diamond", "gold", "iron"], 
            goal: { toString(): string {return "no goals"}, isAchieved: () => false, isDefeated: () => false }
        },
        {
            name: "test2",
            x:16,
            y:12,
            allowedSpites: ["square", "circle", "rumb", "triangle"],
            goal: {
                isAchieved(score): boolean{ return score!.score > 1000 },
                isDefeated(score): boolean{ return score!.step > 20},
                toString(): string {
                    return "score more than 1000 less then 20 steps"
                },
        } as Goal
        }
    ]

export default function retrieveStage(name: string): FieldParams | undefined {
    return scenes.find(sc => sc.name == name)
}

export function getStageNames(): string[]{
    let stages : string[] = []
    scenes.forEach(scene => stages.push(scene.name))
    return stages
}