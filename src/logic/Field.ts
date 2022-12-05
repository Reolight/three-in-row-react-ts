import retrieveStage, { FieldParams } from "../sources/data/Scenes"
import Score from "./Score"
import SpriteInt from "./interfaces/SpriteInt"
import LevelReader, { cell_definition } from "./auxillary/LevelReader"
import retrieveSprite from "../sources/data/Sprites"
import Cell from "./Cell"
import Chain from "./Chain"
import Goal from "./interfaces/Goal"
import {Position} from "./interfaces/Position"
import Sprite from "./Sprite"
import Motion from "./interfaces/Motion"
import Generator from "./Generator"
import randomInt from "./RandomInt"
import Loader from "../sources/data/Loader"

    /**
     * This class contains a lot of field-logic. It is a collector of all three-in-row logic and can be called 
     * a 'controller'. Here are settings of a screen, matching logic (some of which is performed by executioner 
     * named as Chain), deletion logic and more
     * Maybe, it should be separated in several files, like Engine, Field and some more, but due to 
     * some unexplainable reasons it remains as is. (The one major reason: a lot of code refactoring. 
     * Somebody said: if it works, don't touch. So, I decided to not touch it now)
     * [This non tech comment was leaved here because this code is my property and I can do whatever I want and write 
     * tales whenever I want]
     */
export default class Field {
    static Cell_size : number = 64 
    static OffsetX: number
    static OffsetY: number

    base_background: string
    wallpaper?: string

    size: Position
    cell_definitions: cell_definition[] = []
    cells: Cell[][] = []
    name: string
    allowedSprites: SpriteInt[] = []
    goal: Goal
    force_destroy: boolean = false //force destroy for narked without matched

    sprites: Sprite[] = []
    animations: Motion[] = []

    score: Score = {} as Score

    constructor(field_params: FieldParams) {
        this.name = field_params.name;
        this.size = {x: field_params.x, y: field_params.y}
        this.base_background = Loader.getBack(this.name, "def.png")!
        if (field_params.wallpaper) 
            this.wallpaper = Loader.getWallpaper(this.name, field_params.wallpaper)

        field_params.allowedSprites.forEach(name => {
            const sprite = retrieveSprite(name)
            sprite && this.allowedSprites.push(sprite)
        })

        Cell.field = this
        Generator.init(this.allowedSprites)
        if (field_params.definitions) {
            const clone = require("rfdc/default")
            this.cell_definitions = clone(field_params.definitions) as cell_definition[]
            for (let i = 0; i < this.cell_definitions.length; i++){
                this.cell_definitions[i].tile.image = field_params.definitions[i].tile.image?
                    Loader.getBack(this.name, field_params.definitions[i].tile.image!) : this.base_background
            }
        }
        
        this.allowedSprites.forEach(sprite => console.debug(`[${sprite.name}: ${sprite.sprite}]`))
        this.goal = field_params.goal
        this.initialGeneration(field_params)
        this.score = new Score(field_params.allowedSprites)
    }

    getBackground(cell: Cell){
        if (this.cell_definitions.length > 0){
            return this.cell_definitions.find(def => def.key === cell.key)?.tile.image
        }
        else return this.base_background
    }

    addSprite(sprite: SpriteInt, pos: Position) {
        const s : Sprite = new Sprite(sprite, pos)
        this.sprites.push(s)
        this.cells[pos.y][pos.x].sprite = s
    }

    destroySprite(id: number){
        const index = this.sprites.findIndex(s => s.id === id)
        if (index === -1){
            console.warn(`Sprite with id ${id} seems already have been deleted`)
            return
        }

        console.debug(`trying delete with id ${id}: index - ${index}`, this.sprites[index])
        this.score.destroyed.find(d => d.name 
            === this.cells[this.sprites[index].position.y][this.sprites[index].position.x].sprite.name)!.value++
        this.cells[this.sprites[index].position.y][this.sprites[index].position.x].sprite = {} as Sprite
        this.cells[this.sprites[index].position.y][this.sprites[index].position.x].unmarkFromDelete()
        this.sprites.splice(index, 1)
    }

    static getStage(name: string): Field{
        const stage = retrieveStage(name)
        if (!stage) console.error(`Stage ${name} doesn't exist`);
        return new Field(stage!);
    }

    private initialGeneration(params: FieldParams){
        console.debug(`generation of ${this.size.x}x${this.size.y}`)
        this.cells = LevelReader({x: params.x, y: params.y}, params.stringified_field, params.definitions)

        let x = 0; let y = 0;
        this.cells.forEach(row => {
            row.forEach(cell => {
                if (cell.isExist && !cell.isBlocked){
                    const sprite: Sprite = new Sprite(Generator.GetRandomCalculated(true), {x, y})
                    cell.sprite = sprite
                    this.sprites.push(sprite)
                }

                x++
            })
            x=0
            y++
        })
    }

    /**
     * Set's up new offset values to render field in the center of screen.
     * @param screen_width - screen width (width in px of div which contains field)
     * @param screen_height - screen height
     * @param width - width of field in cells count
     * @param height - height of field in cells count
     */
    static setOffset(screen_width: number, screen_height: number, width: number, height: number){
        Field.OffsetX = (screen_width - width * Field.Cell_size) / 2
        Field.OffsetY = (screen_height - height * Field.Cell_size) / 2
    }

    //===========================[LOGIC]===================================

    private static MatchRow(cells: Cell[], or: 'v' | 'h' | 'n', center?: Position){
        for (let x = cells.length - 2; x > 0; x--){
            if ((!cells[x-1].isEmpty() || !cells[x].isEmpty() || !cells[x+1].isEmpty()) && !cells[x].sprite.isCollectable){
                if (!Chain.isOpened) {
                        if (cells[x].sprite.name){
                            if (cells[x-1].sprite.name === cells[x].sprite.name
                                && cells[x].sprite.name === cells[x+1].sprite.name)
                            {
                                Chain.open([ cells[x-1], cells[x], cells[x+1] ], or)
                                if (center) Chain.makeCenter(center)
                            }
                    }
                }
                else if (cells[x].sprite.name === cells[x-1].sprite.name){
                    Chain.add(cells[x-1])
                } else Chain.isOpened && Chain.close()
            }
        }
    }

    private getColumn(x: number): Cell[]{
        let column: Cell[] = []
            this.cells.forEach(row => {
                column.push(row[x])
            })

        return column
    }

    /**
     * This funciton is designed for matching search. Here are two modes of search now:
     * mode ALL - searches all matches in a field
     * mode CENTER - makes search in rows and colums where swapped tiles are situated to get rid of 
     * unneccessary checks and speed up the function. Also it helps define exact position, where effect
     * should be situated
     * Mode switches by having or not [pos1, pos2] array
     * @param f - reference to a field
     * @param positions - it is a [pos1, pos2] array of swapped sprites.
     * @returns back reference to the gotten field to make setState inline
     */
    static Match(f: Field, [pos1, pos2]: Position[] = []) {         
        Chain.sizePrepare(f.cells.length)
        if (pos1 && pos2){
            Field.MatchRow(f.cells[pos1.y], 'h', pos1)
            Field.MatchRow(f.getColumn(pos1.x), 'v', pos1)
            if (pos1.x === pos2.x) Field.MatchRow(f.cells[pos2.y], 'h', pos2)
                else Field.MatchRow(f.getColumn(pos2.x), 'v', pos2)
            return;
        }

        for (let iy = f.cells.length - 1; iy >= 0; iy--){
            Field.MatchRow(f.cells[iy], 'h')
        }

        for (let ix = 0; ix < f.cells[0].length; ix++){
            Field.MatchRow(f.getColumn(ix), 'v')
        }
    }

    /**
     * returns true, if there is at least one possible combination
     */
    CheckAvailableCombinations(): boolean{
            for (let row = 0; row < this.cells.length; row++){
                for (let ind = 0; ind < this.cells[row].length; ind++){
                    if ((ind > 0 && ind < this.cells[row].length - 1) && //checking starts only if IND within this interval
                        (!this.cells[row][ind-1].isEmpty() && !this.cells[row][ind+1].isEmpty()) && //prev & next are not empty
                        (this.cells[row][ind-1].sprite.name === this.cells[row][ind+1].sprite.name //they are equal
                            && !this.cells[row][ind-1].sprite.isCollectable) &&  //and not collectable
                        ((this.cells.length > row + 1 &&
                            (!this.cells[row+1][ind].isEmpty() && this.cells[row+1][ind].sprite.name === this.cells[row][ind-1].sprite.name))
                    ||  (row > 0 
                            && (!this.cells[row - 1][ind].isEmpty() && this.cells[row - 1][ind].sprite.name === this.cells[row][ind-1].sprite.name))
                    )) return true //then there is still minimum one available combination
                    
                        //check for Y (colums)
                    if ((row > 0 && row < this.cells.length - 1) &&
                        (!this.cells[row - 1][ind].isEmpty() && !this.cells[row + 1][ind].isEmpty()) &&

                        (this.cells[row - 1][ind].sprite.name === this.cells[row + 1][ind].sprite.name && !this.cells[row - 1][ind].isEmpty() 
                            && !this.cells[row + 1][ind].sprite.isCollectable) &&
                        ((ind > 0 && (!this.cells[row][ind - 1].isEmpty() 
                            && this.cells[row][ind - 1].sprite.name === this.cells[row + 1][ind].sprite.name)) ||
                        ( ind + 1 < this.cells[row].length && (!this.cells[row][ind + 1].isEmpty()
                            && this.cells[row][ind + 1].sprite.name === this.cells[row + 1][ind].sprite.name)))
                    ) return true
                }
            }            

        return false
    }

        /** It shuffles field if there are no combinations */
    static Shuffle(f: Field): Field{
        let deployable : Sprite[] = [...f.sprites] //shallow copy: need to store refs to sprites, but not a ref to array itseld
        f.cells.forEach(row => {
            row.forEach(cell =>{
                if (cell.isPlaceable() && deployable.length > 0){
                    const index = randomInt(deployable.length - 1)
                    const sprite = deployable[index]
                    cell.sprite = sprite
                    sprite.position = {x: cell.pos.x, y: cell.pos.y}
                    deployable.splice(index, 1)
                }
            })
        })

        return f
    }

    Destroy(): number {
        Chain.releaseRecollection(this)

        let points : number = 0
        this.cells.forEach(row => 
            row.forEach(cell => {
                if (cell.isDeathmarked()) {
                    this.destroySprite(cell.sprite.id)
                    points++
                }
            })
        )

        this.force_destroy = false
        return points
    }

    private static Generate(field : Field): number {
        let generated: number = 0
        field.cells[0].forEach(cell => {
            if (cell.isPlaceable() && cell.isEmpty()){
                field.addSprite(Generator.GetRandomCalculated(), cell.pos)
                generated++
            }
        });
        
        return generated
    }

    //this variable for fall-management
    strict: boolean = false
    static Fall(f: Field): [field:Field, changes: number] {
        let changes: number = 0

        for (let i = 0; i < f.cells[0].length; i++){
            if (f.cells[f.cells.length - 1][i].sprite && f.cells[f.cells.length - 1][i].sprite.isCollectable){
                f.destroySprite(f.cells[f.cells.length - 1][i].sprite.id)
                changes++
            }
        }

        for (let row = f.cells.length - 2; row >= 0; row--){
            for (let x = 0; x < f.cells[row].length ; x++){
                if (!f.cells[row][x].isEmpty() && f.cells[row][x].isMovable()){ //current is NOT empty and not blocked

                    if (f.cells[row + 1][x].isAvailableForDrop()) { //cell in row below is empty, not blocked and not frozen
                        f.cells[row][x].drop(f.cells[row + 1][x])
                        changes++
                    }
                    
                    if (!f.strict){
                            //if there is no empty cell below, check sides
                        if (f.cells[row + 1][x - 1] && f.cells[row + 1][x - 1].isAvailableForDrop()){
                            f.cells[row][x].drop(f.cells[row + 1][x - 1])
                            changes++

                        } else if (f.cells[row + 1][x + 1] && f.cells[row + 1][x + 1].isAvailableForDrop()){
                            f.cells[row][x].drop(f.cells[row + 1][x + 1])
                            changes++
                        }
                    }
                }
            }
        }

        changes += Field.Generate(f)
        if (f.strict && changes === 0) {
            f.strict = false
            changes++
        }

        if (!f.strict && changes === 0) f.strict = true
        return [f, changes]
    }

    private static StringRows(f: Field): string[]{
        let s : string[] = []
        f.cells.forEach(row => {
            let r: string = ""
            row.forEach(cell => {
                if (!cell.sprite) r += " "
                else r += cell.sprite.name ? cell.sprite.name[0]: "-"
            })
            s.push(r)
        });

        return s
    }

    private static StringCols(f: Field): string[]{
        let c: string[] = []
        for (let ix = 0; ix < f.cells[0].length; ix++){
            let column: string = ""
            f.cells.forEach(row => {
                if (!row[ix].sprite) column += " "
                else column += row[ix].sprite.name? row[ix].sprite.name[0] : "-"
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