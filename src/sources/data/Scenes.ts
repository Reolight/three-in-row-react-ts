import Field from "../../logic/Field";

const scenes : Field[] =
    [
        new Field("test stage", 8, 8, ["diamond", "gold", "iron"], { isAchieved: () => false })
    ]

export default function retrieveStage(name: string): Field | undefined {
    return scenes.find(sc => sc.name == name)
}