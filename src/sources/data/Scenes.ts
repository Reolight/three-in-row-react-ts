import Goal from "../../logic/interfaces/Goal";

interface FieldParams{
    name: string
    x: number
    y: number
    allowedSpites: string[]
    goal: Goal
}

const scenes : FieldParams[] =
    [
        {
            name: "test stage",
            x: 8,
            y: 8, 
            allowedSpites: ["diamond", "gold", "iron"], 
            goal: { isAchieved: () => false }
        },
        {
            name: "test2",
            x:16,
            y:12,
            allowedSpites: ["square", "circle", "rumb", "triangle"],
            goal: { isAchieved: () => false }
        }
    ]

export default function retrieveStage(name: string): FieldParams | undefined {
    return scenes.find(sc => sc.name == name)
}