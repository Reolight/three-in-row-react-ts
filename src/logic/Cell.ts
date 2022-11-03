import Effect from "./interfaces/Effect";
import Position from "./interfaces/Position";
import Sprite from "./interfaces/Sprite";
import Tile from "./interfaces/Tile";

export default class Cell implements Tile {
    sprite: Sprite = {} as Sprite
    markedForDelete : boolean = false

    pos: Position
    isExist : boolean
    isBlocked : boolean = false //items can not be placed here
    isFrozen : boolean = false //can be here but cant be moved out
    effects: Effect[] = []

    constructor(exist: boolean, position: Position, initialEffects: Effect[]){
        this.pos = position
        this.isExist = exist;
        if (!this.isExist) return
        this.effects = initialEffects
    }

    isAvailableForFall(){
        return (this.isExist && !this.isBlocked && !this.isFrozen && !this.sprite.sprite)
    }

    getBackground(isSelected: boolean): string {
        const file = require(`../sources/backs/${isSelected?"sel.png":"def.png"}`)
        return file
    }

    getSprite(): string {
        const file = this.sprite.sprite? require(`../sources/sprites/${this.sprite.sprite}`): ""
        return file
    }

    isEmpty(): boolean{
        return this.sprite? false: true
    }

    swap(cell: Cell, isAdjacentOnly: boolean = true){
        const sprite: Sprite = this.sprite
        this.sprite = cell.sprite
        cell.sprite = sprite
    }

    posToString(){
        return `${this.pos.y}:${this.pos.x}`
    }
}