import retrieveSprite from "../sources/data/Sprites";
import Effect from "./interfaces/Effect";
import Position from "./interfaces/Position";
import Sprite from "./Sprite";
import Tile from "./interfaces/Tile";

export default class Cell implements Tile {
    sprite: Sprite = {} as Sprite
    markedForDelete : boolean = false

    key?: string
    pos: Position
    isExist : boolean
    isBlocked : boolean = false //items can not be placed here, it is like an obstacle
    isFrozen : boolean = false //can be here but cant be moved out
    effects: Effect[] = []

    constructor(tile: Tile, pos: Position, key?: string){
        if (key) this.key = key
        this.pos = pos
        this.isExist = tile.isExist  //true - draws on field
        this.isBlocked = tile.isBlocked // draws as boulder, sprite can be placed here
        this.isFrozen = tile.isFrozen  //sprite can be placed but can't be moved from here
        if (!this.isExist) return
        this.effects = tile.effects ?? []
    }

    /**
     * is cell empty
     * @returns 
     */
    isEmpty(): boolean{
        return this.sprite.id ? false: true
    }

    /**
     * is able to move
     * @returns 
     */
    isMovable(){
        return (this.isExist && !this.isBlocked && !this.isFrozen)
    }

    isAvailableForDrop(){
        return (this.isMovable() && this.isEmpty())
    }

    /**
     * is can be placed at this cell (empty by default) by generator
     * @returns 
     */
    isPlaceable(){
        return (this.isExist && !this.isBlocked)
    }

    static getSprite(sprite: Sprite): string {
        const file = sprite.sprite? require(`../sources/sprites/${sprite.sprite}`): ""
        return file
    }

    static getSpriteByName(name: string): string {
        const file = name? require(`../sources/sprites/${name}.png`): ""
        return file
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

    markForDelete(){
        if (this.isExist && !this.isBlocked)
            this.markedForDelete = true
    }
}