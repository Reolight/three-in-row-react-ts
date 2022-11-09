import retrieveSprite from "../sources/data/Sprites";
import Effect from "./interfaces/Effect";
import Position from "./interfaces/Position";
import Sprite from "./Sprite";
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

    isAvailableForPlace(){
        return (this.isExist && !this.isBlocked && !this.isFrozen && !this.sprite.sprite)
    }

    isAvailableForInitialPlace(){
        return (this.isExist && !this.isBlocked && !this.sprite.sprite)
    }

    getBackground(isSelected: boolean): string {
        const file = require(`../sources/backs/${isSelected?"sel.png":"def.png"}`)
        return file
    }

    static getSprite(sprite: Sprite): string {
        const file = sprite.sprite? require(`../sources/sprites/${sprite.sprite}`): ""
        return file
    }

    static getSpriteByName(name: string): string {
        const file = name? require(`../sources/sprites/${name}.png`): ""
        return file
    }

    isEmpty(): boolean{
        return this.sprite? false: true
    }

    swap(cell: Cell, isAdjacentOnly: boolean = true): boolean {
        if (!Position.isAdjacent(this.pos, cell.pos) && isAdjacentOnly){
            console.warn(`${this.pos.toString()} and ${cell.pos.toString()} not adjacent`)
            return false
        }

        const sprite: Sprite = this.sprite
        this.sprite = cell.sprite
        cell.sprite = sprite

        cell.sprite.position = Position.positionChange(cell.pos)
        this.sprite.position = Position.positionChange(this.pos)
        return true
    }
    
    drop(cell: Cell){
        //now it is alias of swap
        return this.swap(cell, false)
    }
}