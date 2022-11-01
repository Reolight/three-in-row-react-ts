import Sprite from "../../logic/interfaces/Sprite"

const sprites: Sprite[] = [
    {
        sprite: `diamond.png`,
        name: "diamond",
        onDestroyEffect: undefined
    },
    {
        sprite: `gold.png`,
        name: "gold",
        onDestroyEffect: undefined
    },
    {
        sprite: `iron.png`,
        name: "iron",
        onDestroyEffect: undefined
    }
]

export default function retrieveSprite(t: string): Sprite | undefined {
    return sprites.find(s => s.name === t)
}