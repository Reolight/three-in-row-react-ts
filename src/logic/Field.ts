import { randomInt } from "crypto"
import retrieveSprite from "../sources/data/Sprites"
import Goal from "./interfaces/Goal"
import Sprite from "./interfaces/Sprite"
import Tile from "./interfaces/Tile"

export default class Field {
    tiles: Tile[][]
    name: string
    allowedSprites: Sprite[] = []
    goal: Goal
    constructor(name: string, x: number, y: number, allowedSprites: string[], goal: Goal){
        this.name = name;
        this.tiles = [[]]
        allowedSprites.forEach(name => {
            const sprite = retrieveSprite(name)
            sprite && this.allowedSprites.push(sprite)
        } )
        this.goal = goal;
    }

    private initialGeneration(){
        this.tiles.forEach(row => {
            row.forEach(tile => {
                tile.isExist = true
                
            });
        });
    }
}