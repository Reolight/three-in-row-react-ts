import { TileType } from "./auxillary/TileType"
import { Vector2D } from "./auxillary/vectors"
import building from "./Building"

export default class Tile {
    static default_size : number = 256
    
    name: string = ""
    position?: Vector2D
    height: number = 0
    surf_image: string = ""
    depth_image: string = ""
    //image?: string - Removed for now, cuz FabricJS IS GARBAGE
    tile_type: TileType = "unknown"
    
    should_be_drawed_full: boolean = false // if true, renders sides
        ///true in case of cur height > height of neighbours
    private occupied_by?: building

    isEmpty(): boolean {
        return !this.occupied_by && (this.tile_type !== 'obstDestr' && this.tile_type !== 'obstNDestr')
    }
}