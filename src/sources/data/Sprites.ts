import SpriteInt from "../../logic/interfaces/SpriteInt"
import Sprite from "../../logic/interfaces/SpriteInt"
import clone from "../../shared/clone"
import Loader from "./Loader"

const sprites: Sprite[] = [
    {
        name: "diamond_c",
        sprite: "diamond",
        isCollectable: true,
        isImmortal: true,
        probability: 5,
        max_count: 5
    }
]
    /**
     * Used to recieve sprite image by name
     * @param name - name of sprite
     * @returns strinified image of named sprite or nothing
     */
export function getSpriteByName(stage_name: string, name: string): string | undefined {
    const sprite = sprites.find(sprite => sprite.name === name)
    const namae = (sprite?.sprite ?? name) + ".png"
    return Loader.getSprite(stage_name, namae)
}

    ///returns sprite defined in sprites[] or creates new default sprite to get rid of defining defaults
export default function retrieveSprite(t: string): Sprite {
    let sprite = sprites.find(s => s.name === t)
    let result: SpriteInt
    if (!sprite){
        result = {
            sprite: require(`../sprites/${t}.png`),
            name: t,
            isCollectable: false,
            isImmortal: false
        }
    } else {
        result = clone<SpriteInt>(sprite)
        result.sprite = require(`../sprites/${sprite.sprite}.png`)
    }

    return result
}