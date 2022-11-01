import retrieveStage from "../sources/data/Scenes"
import retrieveSprite from "../sources/data/Sprites"
import Cell from "./Cell"
import Goal from "./interfaces/Goal"
import Position from "./interfaces/Position"
import Sprite from "./interfaces/Sprite"
import randomInt from "./RandomInt"

export default class Field {
    size: Position
    cells: Cell[][] = []
    name: string
    allowedSprites: Sprite[] = []
    goal: Goal
    constructor(name: string, x: number, y: number, allowedSprites: string[], goal: Goal){
        this.name = name;
        this.size = {x, y}
        allowedSprites.forEach(name => {
            const sprite = retrieveSprite(name)
            sprite && this.allowedSprites.push(sprite)
        })

        this.allowedSprites.forEach(sprite => console.debug(`[${sprite.name}: ${sprite.sprite}]`))
        this.goal = goal
        this.initialGeneration()
    }

    static getStage(name: string): Field{
        const stage = retrieveStage(name)
        if (!stage) console.error(`Stage ${name} doesn't exist`);
        return new Field(stage!.name, stage!.x, stage!.y, stage!.allowedSpites, stage!.goal);        
    }

    private initialGeneration(){
        console.debug(`generation of ${this.size.x}x${this.size.y}`)
        for (let igrek = 0; igrek < this.size.y; igrek++){
            let row: Cell[] = []
            for (let ix = 0; ix < this.size.x; ix++){
                let c = new Cell(true, {x:ix, y: igrek}, [])
                const spriteId : number = randomInt(this.allowedSprites.length)
                c.sprite = this.allowedSprites[spriteId]
                row.push(c)
            }

            this.cells.push(row)
        }
    }
}