import Effect from "./interfaces/Effect";
import Position from "./interfaces/Position";
import Sprite from "./Sprite";
import Tile from "./interfaces/Tile";
import Effector from "./Effector";
import Field from "./Field";

export default class Cell implements Tile {
    static field: Field
    sprite: Sprite = {} as Sprite
    private markedForDelete : boolean = false

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
        return this.sprite.id ? false : true
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
        if (this.isPlaceable() && !this.isEmpty() && !this.sprite.isImmortal && !this.markedForDelete){
            this.markedForDelete = true            
            if (this.sprite.effect) Effector.destroy(Cell.field, this.pos, this.sprite.effect!.id!)
        }
    }

    collect(){
        if (this.isPlaceable() && !this.isEmpty() && this.sprite.isCollectable)
            this.markedForDelete = true
    }

    unmarkFromDelete(){
        this.markedForDelete = false;
    }

    isDeathmarked(): boolean{
        return this.markedForDelete
    }
}