import Position from "./interfaces/Position";
import SpriteInt from "./interfaces/SpriteInt";

export default class Sprite implements SpriteInt{
    static count : number = 0

    id: number
    name: string
    sprite: string //path to img
    position : Position

    constructor(sprite: SpriteInt, position: Position){
        this.id = Sprite.count++
        this.name = sprite.name
        this.sprite = sprite.sprite
        this.position = new Position(position.x, position.y)
    }
}