import Effect from "./interfaces/Effect";
import { isAdjacent, Position } from "./interfaces/Position";
import Sprite from "./Sprite";
import Tile from "./interfaces/Tile";
import Effector from "./Effector";
import Field from "./Field";
import Motion from "./interfaces/Motion";

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
    isMovable(): boolean{
        return (this.isExist && !this.isBlocked && !this.isFrozen)
    }

    isAvailableForDrop(): boolean{
        return (this.isMovable() && this.isEmpty())
    }

    /**
     * is can be placed at this cell (empty by default) by generator
     * @returns 
     */
    isPlaceable(): boolean{
        return (this.isExist && !this.isBlocked)
    }

    static getSprite(sprite: Sprite): string {
        const file = sprite.sprite? require(`../sources/sprites/${sprite.sprite}`): ""
        return file
    }

    private swap_core(cell: Cell)
    {       
        const sprite: Sprite = this.sprite
        this.sprite = cell.sprite
        cell.sprite = sprite

        cell.sprite.position = cell.pos
        this.sprite.position = this.pos
    }

    swap(cell: Cell): boolean {
        if (!isAdjacent(this.pos, cell.pos)){
            console.warn(`${this.pos.toString()} and ${cell.pos.toString()} not adjacent`)
            return false
        }

        this.swap_core(cell)

        if (this.sprite.effect && this.sprite.effect.active) {try{
                Effector.raiseMotion(Cell.field, this.sprite.effect.onSwapped(Cell.field, cell), this.pos)
            } catch {/* no effect on swap requires no action*/}
        }

        if (cell.sprite.effect && cell.sprite.effect.active) { try{
                Effector.raiseMotion(Cell.field, cell.sprite.effect.onSwapped(Cell.field, this), cell.pos)
            } catch {}
        }

        return true
    }
    
    drop(cell: Cell){
        return this.swap_core(cell)
    }

    markForDelete(){
        if (this.isPlaceable() && !this.isEmpty() && !this.sprite.isImmortal && !this.markedForDelete){
            this.markedForDelete = true
            if (Cell.field.force_destroy === false) Cell.field.force_destroy = true //destroys even if cur cell is not in chain
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