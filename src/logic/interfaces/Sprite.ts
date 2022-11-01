import Effect from "./Effect";
import Position from "./Position";

export default interface Sprite{
    type: string
    onDestroyEffect?: Effect[]
    sprite: string //path to img
}