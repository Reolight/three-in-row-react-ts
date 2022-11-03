import Sprite from "../../logic/interfaces/Sprite"

const sprites: Sprite[] = [
    
]

    ///returns sprite defined in sprites[] or creates new default sprite to get rid of defining defaults
export default function retrieveSprite(t: string): Sprite | undefined {
    let sprite = sprites.find(s => s.name === t)
    if (!sprite){
        sprite = {
            sprite: `${t}.png`,
            name: t,
            onDestroyEffect: undefined
        }
    }

    return sprite
}