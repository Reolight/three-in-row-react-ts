import retrieveStage from "../sources/data/Scenes"
import retrieveSprite from "../sources/data/Sprites"
import Cell from "./Cell"
import Chain from "./Chain"
import Goal from "./interfaces/Goal"
import Position from "./interfaces/Position"
import Sprite from "./Sprite"
import randomInt from "./RandomInt"
import Score from "./Score"
import SpriteInt from "./interfaces/SpriteInt"
import Effector from "./Effector"

export default class Field {
    static Cell_size : number = 64 

    size: Position
    cells: Cell[][] = []
    name: string
    allowedSprites: SpriteInt[] = []
    goal: Goal

    sprites: Sprite[] = []

    score: Score = {} as Score

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
        this.score = new Score(allowedSprites)
    }

    addSprite(sprite: SpriteInt, pos: Position) {
        const s : Sprite = new Sprite(sprite, pos)
        this.sprites.push(s)
        this.cells[pos.y][pos.x].sprite = s
    }

    destroySprite(id: number){
        const index = this.sprites.findIndex(s => s.id == id)
        if (index == -1){
            console.warn(`Sprite with id ${id} seems already have been deleted`)
            return
        }

        console.debug(`trying delete with id ${id}: index - ${index}`, this.sprites[index])
        this.cells[this.sprites[index].position.y][this.sprites[index].position.x].sprite = {} as Sprite
        this.cells[this.sprites[index].position.y][this.sprites[index].position.x].markedForDelete = false
        this.sprites.splice(index, 1)
    }

    static getStage(name: string): Field{
        const stage = retrieveStage(name)
        if (!stage) console.error(`Stage ${name} doesn't exist`);
        return new Field(stage!.name, stage!.x, stage!.y, stage!.allowedSpites, stage!.goal);        
    }

    private getRandomSprite(): SpriteInt {
        return this.allowedSprites[randomInt(this.allowedSprites.length)]
    }

    private initialGeneration(){
        console.debug(`generation of ${this.size.x}x${this.size.y}`)
        for (let igrek = 0; igrek < this.size.y; igrek++){
            let row: Cell[] = []
            for (let ix = 0; ix < this.size.x; ix++){
                let c = new Cell(true, {x: ix, y: igrek}, [])
                const s : Sprite = new Sprite(this.getRandomSprite(), c.pos)
                this.sprites.push(s)
                c.sprite = s
                row.push(c)
            }

            this.cells.push(row)
        }
    }

    //===========================[LOGIC]===================================

    private static MatchRow(cells: Cell[], or: 'v' | 'h' | 'n'){
        for (let x = cells.length - 2; x > 0; x--){
            if (!Chain.isOpened) {
                    if (cells[x].sprite.name){
                        if (cells[x-1].sprite.name === cells[x].sprite.name
                            && cells[x].sprite.name === cells[x+1].sprite.name)
                        {
                            Chain.open([ cells[x-1], cells[x], cells[x+1] ], or)
                        }
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
            Field.MatchRow(f.cells[iy], 'h')
        }

        for (let ix = 0; ix < f.cells[0].length; ix++){
            let column: Cell[] = []
            f.cells.forEach(row => {
                column.push(row[ix])
            })
            Field.MatchRow(column, 'v')
        }
        
        return f
    }

    static Destroy(old: Field): number {
        let f : Field = old
        Chain.releaseRecollection(f)

        let points : number = 0
        f.cells.forEach(row => 
            row.forEach(cell => {
                if (cell.markedForDelete) {
                    if (cell.sprite.effect)
                        Effector.destroy(f, cell.pos, cell.sprite.effect!.id!)

                    f.destroySprite(cell.sprite.id)
                    points++
                }
            })
        )

        return points
    }

    private static Generate(field : Field): number {
        let generated: number = 0
        field.cells[0].forEach(cell => {
            if (cell.isAvailableForPlace()){
                field.addSprite(field.getRandomSprite(), cell.pos)
                generated++
            }
        });
        
        return generated
    }

    static Fall(old: Field, strict: boolean = true): [field:Field, changes: number] {
        let f : Field = old
        let changes: number = 0

        for (let row = f.cells.length - 2; row >= 0; row--){
            for (let x = 0; x < f.cells[row].length ; x++){

                if (!f.cells[row][x].isFrozen && f.cells[row][x].sprite.sprite){ //current is NOT empty and not blocked

                    if (f.cells[row + 1][x].isAvailableForPlace()) { //cell in row below is empty, not blocked and not frozen
                        f.cells[row][x].drop(f.cells[row + 1][x])
                        changes++
                    }
                    
                    if (!strict){
                            //if there is no empty cell below, check sides
                        if (f.cells[row + 1][x - 1] && f.cells[row + 1][x - 1].isAvailableForPlace()){
                            f.cells[row][x].drop(f.cells[row + 1][x - 1])
                            changes++

                        } else if (f.cells[row + 1][x + 1] && f.cells[row + 1][x + 1].isAvailableForPlace()){
                            f.cells[row][x].drop(f.cells[row + 1][x + 1])
                            changes++
                        }
                    }
                }
            }
        }

        changes += Field.Generate(f)
        Field.StringField(f)
        return [f, changes]
    }

    private static StringRows(f: Field): string[]{
        let s : string[] = []
        f.cells.forEach(row => {
            let r: string = ""
            row.forEach(cell => r += cell.sprite.name ? cell.sprite.name[0]: "-")
            s.push(r)
        });

        return s
    }

    private static StringCols(f: Field): string[]{
        let c: string[] = []
        for (let ix = 0; ix < f.cells[0].length; ix++){
            let column: string = ""
            f.cells.forEach(row => {
                column += row[ix].sprite.name? row[ix].sprite.name[0] : "-"
            })

            c.push(column)
        }

        return c
    }

    private static StringField(f: Field){
        const rows = Field.StringRows(f)
        const cols = Field.StringCols(f)       

        console.debug(`rows, columns: `, rows, cols);
    }

    static EnsureNoMatchWithRegex(f : Field): boolean{
        const reg : RegExp = new RegExp(`/(.)(?:.*\\1){3,}`)
        const rows = Field.StringRows(f)
        let isMatch : boolean = false
        rows.forEach(r => {if (reg.test(r)) isMatch = true})
        if (isMatch) return isMatch
        
        const cols = Field.StringCols(f)
        cols.forEach(c => {if (reg.test(c)) isMatch = true})
        return isMatch
    }
}