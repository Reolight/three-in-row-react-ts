import Effect from "./Effect";

export default interface Sprite{
    name: string
    onDestroyEffect?: Effect[]
    sprite: string //path to img
}