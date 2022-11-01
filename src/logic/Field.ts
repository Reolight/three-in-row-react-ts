import { randomInt } from "crypto"
import retrieveStage from "../sources/data/Scenes"
import retrieveSprite from "../sources/data/Sprites"
import Cell from "./Cell"
import Goal from "./interfaces/Goal"
import Sprite from "./interfaces/Sprite"
import Tile from "./interfaces/Tile"

export default class Field {
    cells: Cell[][] = []
    name: string
    allowedSprites: Sprite[] = []
    goal: Goal
    constructor(name: string, x: number, y: number, allowedSprites: string[], goal: Goal){
        this.name = name;
        allowedSprites.forEach(name => {
            const sprite = retrieveSprite(name)
            sprite && this.allowedSprites.push(sprite)
        } )
        this.goal = goal;
        this.initialGeneration()
    }

    static getStage(name: string): Field{
        const stage = retrieveStage(name)
        if (!stage) console.error(`Stage ${name} doesn't exist`);
        return stage!;        
    }

    private initialGeneration(){
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                cell = new Cell(true, {x, y}, [])
                const spriteId : number = randomInt(this.allowedSprites.length)
                this.cells[x][y].sprite = this.allowedSprites[spriteId]
            });
        });
    }
}