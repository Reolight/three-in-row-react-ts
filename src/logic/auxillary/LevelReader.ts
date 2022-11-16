/**
 * This function 
 */

 import Cell from "../Cell";
 import Position from "../interfaces/Position";
 import Tile from "../interfaces/Tile";

export interface cell_definition{
    key: string
    tile: Tile
}

/**
 * This function returns cell array, not sprite! Cell can be blocked or affected by effect.
 * All parameters are optional, but should be used in next two combinations:
 * size OR stringified_field + definitions
 * @param size - size of field in case of empty stringified_field to render default field
 * @param stringified_field - array of rows, where each symbol represents cell with given parameters
 * @param definitions - key-value object, required for decyphrying stringifyed_field
 */
export default function LevelReader(size?: Position, stringified_field?: string[], definitions?: cell_definition[]): Cell[][]{
    if (!stringified_field) return return_default(size!)
    if (stringified_field && definitions){
        let cells : Cell[][] = []
        for (let y : number = 0; y < stringified_field.length; y++){
            let row : Cell[] = []
            for (let x : number = 0; x < stringified_field[0].length; x++){
                const tile = definitions.find(def => def.key === stringified_field[y][x])?.tile ??
                    {effects: [], isBlocked: false, isExist: false, isFrozen: false} as Tile
                row.push(new Cell(tile, {x,y}))
            }
            
            cells.push(row)
        }

        return cells
    }

    return []
}

function return_default(size: Position){
    let cells: Cell[][] = []
    console.debug(`generation of ${size.x}x${size.y}`)
    for (let igrek = 0; igrek < size.y; igrek++){
        let row: Cell[] = []
        for (let ix = 0; ix < size.x; ix++){
            let c = new Cell({isExist: true, isBlocked: false, isFrozen: false}, {x: ix, y: igrek})
            row.push(c)
        }

        cells.push(row)
    }
    
    return cells
}