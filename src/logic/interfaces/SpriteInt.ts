import Effect from "./Effect";

export default interface SpriteInt{
    name: string
    sprite: string //path to img
    probability?: number
    max_count?: number
    isCollectable: boolean
    isImmortal: boolean
}