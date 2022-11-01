import Sprite from "../../logic/interfaces/Sprite"

const sprites: Sprite[] = [
    {
        sprite: `sources\sprites\diamond.png`,
        type: "diamond",
        onDestroyEffect: undefined
    },
    {
        sprite: `sources\sprites\gold.png`,
        type: "gold",
        onDestroyEffect: undefined
    },
    {
        sprite: `sources\sprites\iron.png`,
        type: "iron",
        onDestroyEffect: undefined
    }
]

export default function retrieveSprite(t: string): Sprite | undefined {
    return sprites.find(s => s.type === t)
}