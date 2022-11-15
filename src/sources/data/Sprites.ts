import Sprite from "../../logic/interfaces/SpriteInt"

const sprites: Sprite[] = [
    
]

    ///returns sprite defined in sprites[] or creates new default sprite to get rid of defining defaults
export default function retrieveSprite(t: string): Sprite {
    let sprite = sprites.find(s => s.name === t)
    const image = require(`../sprites/${t}.png`)
    if (!sprite){
        sprite = {
            sprite: image,
            name: t
        }
    }

    return sprite
}