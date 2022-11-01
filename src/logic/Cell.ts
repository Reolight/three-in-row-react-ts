import Effect from "./interfaces/Effect";
import Position from "./interfaces/Position";
import Sprite from "./interfaces/Sprite";
import Tile from "./interfaces/Tile";

export default class Cell implements Tile {
    sprite: Sprite = {} as Sprite

    pos: Position
    isExist : boolean
    effects: Effect[] = []

    constructor(exist: boolean, position: Position, initialEffects: Effect[]){
        this.pos = position
        this.isExist = exist;
        if (!this.isExist) return
        this.effects = initialEffects
    }

    getBackground(isSelected: boolean): string {
        const file = require(`../sources/backs/${isSelected?"sel.png":"def.png"}`)
        return file
    }

    getSprite(): string {
        const file = this.sprite? require(`../sources/sprites/${this.sprite.sprite}`): ""
        return file
    }

    isEmpty(): boolean{
        return this.sprite? false: true
    }
}