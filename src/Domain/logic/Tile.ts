import { TileType } from "./auxillary/TileType"
import { Vector2D } from "./auxillary/vectors"
import building from "./Building"

export default class Tile{
    static default_size : number = 256
    
    name: string = ""
    position?: Vector2D
    image?: string
    tile_type: TileType = "unknown"
    private occupied_by?: building

    isEmpty(): boolean {
        return !this.occupied_by && (this.tile_type !== 'obstDestr' && this.tile_type !== 'obstNDestr')
    }
}