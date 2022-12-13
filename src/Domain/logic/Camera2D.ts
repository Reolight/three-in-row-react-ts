import { Scale, Vector2D } from "./auxillary/vectors";
import { Domain } from "./Domain";
import Chunk from "./structures/Chunk";
import Tile from "./Tile";

interface Corners {
    upper_left: number
    upper_right: number
    lower_left: number
    lower_right: number
}

export default class Camera2D{
    static cameras : Camera2D[] = []
    private domain : Domain //connected domain
    private static count : number = 0

    id: number
    position: Vector2D = {} as Vector2D
    private scale: number = 1.0 //1.0 is a 256px for a tile!

    tile_size : number = Tile.default_size * this.scale * Math.SQRT2
    window_size: Vector2D = {} as Vector2D

    setScale(value: number){
        if (value <= 0) return
        const delta_scale = this.scale - value
        this.position = Scale(this.position, delta_scale)
        this.scale = value
        this.tile_size = Tile.default_size * this.scale * Math.SQRT2
        console.debug(`tile size now ${this.tile_size}:${this.tile_size}`)
    }

    getScale(): number{
        return this.scale
    }

    constructor (pos: Vector2D, size: Vector2D, init_scale: number, domain: Domain){
        this.id = Camera2D.count++
        this.position = pos
        this.window_size = size
        this.setScale(Camera2D.adjustCameraScale(6, this.window_size.x))
        this.domain = domain
        Camera2D.cameras.push(this)
    }

    static adjustCameraScale(numberOtiles_visible_in_row: number, width: number): number{
        return ((width / numberOtiles_visible_in_row) / Math.SQRT2) / Tile.default_size
    }

    private getCorner_y(y: number, x: number, floor: boolean = true): number{
        const v = (2 * y - x)/(Math.SQRT2*Tile.default_size*this.scale)
        return floor? Math.floor(v) : Math.ceil(v)
    }

    private getCorner_x(y: number, x: number, floor: boolean = true): number{
        const v = (2 * y + x)/(Math.SQRT2 * Tile.default_size*this.scale)
        return floor? Math.floor(v): Math.ceil(v)
    }


    getVisible(): Tile[][] {
        return this.domain.chunks[0][0].tiles
        let visible_tiles : Tile[][] = []
        console.debug(`y indexes: ${this.getCorner_y(this.position.x + this.window_size.x, this.position.y)} - `+
            `${this.getCorner_y(this.position.x, this.position.y + this.window_size.y, false)}`)

        for (let y = this.getCorner_y(this.position.x + this.window_size.x, this.position.y);
            y > this.getCorner_y(this.position.x, this.position.y + this.window_size.y, false); 
            y--)
        {
            let row : Tile[] = []
            console.debug(`x indexes: ${this.getCorner_x(this.position.x, this.position.y)} - `+
                `${this.getCorner_x(this.position.x + this.window_size.x, this.position.y + this.window_size.y, false)}`)

            for (let x = this.getCorner_x(this.position.x, this.position.y); 
                x <= this.getCorner_x(this.position.x + this.window_size.x, this.position.y + this.window_size.y, false);
                x++)
            {
                const tile = this.domain.getTile(x,y)
                //if (tile) row.push(tile)
            }

            visible_tiles.push(row)
        }
        
        return visible_tiles
    }

    getDisplayPositionX(x_index: number, y_index: number): number{
        return (Math.SQRT2*Tile.default_size*this.scale*(x_index-y_index))/2 + 220//this.position.x
    }

    getDisplayPositionY(x_index: number, y_index: number){
        return (Math.SQRT2*Tile.default_size*this.scale*(x_index+y_index))/4 - this.position.y
    }
}