import retrieveStage from "../sources/data/Scenes"
import retrieveSprite from "../sources/data/Sprites"
import Cell from "./Cell"
import Chain from "./Chain"
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

    //===========================[LOGIC]===================================

    private static MatchRow(cells: Cell[]){
        for (let x = cells.length - 2; x > 0; x--){
            if (!Chain.isOpened){
                if (cells[x-1].sprite.name === cells[x].sprite.name
                    && cells[x].sprite.name === cells[x+1].sprite.name)
                {
                    Chain.open([ cells[x-1], cells[x], cells[x+1] ])
                }
            }
            else if (cells[x].sprite.name === cells[x-1].sprite.name){
                Chain.add(cells[x-1])
            } else Chain.isOpened && Chain.close()
        }
    }

    static MatchAll(old: Field): Field{         
        let f: Field = old
        Chain.sizePrepare(f.cells.length)
        Field.StringField(f)
        for (let iy = f.cells.length - 1; iy >= 0; iy--){
            Field.MatchRow(f.cells[iy])
        }

        for (let ix = 0; ix < f.cells[0].length; ix++){
            let column: Cell[] = []
            f.cells.forEach(row => column.push(row[ix]))
            Field.MatchRow(column)
        }

        const recollection : Chain[] = Chain.releaseRecollection()
        recollection.forEach(chain => chain.cells.forEach(cell => 
            f.cells[cell.pos.y][cell.pos.x].markedForDelete = true
        ))

        return f
    }

    private static StringField(f: Field){
        let s : string[] = []
        f.cells.forEach(row => {
            let r: string = ""
            row.forEach(cell => r += cell.sprite.name[0])
            s.push(r)
        });

        console.log(s);
    }
}