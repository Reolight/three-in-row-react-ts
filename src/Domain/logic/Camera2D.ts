import { Scale, Vector2D } from "./auxillary/vectors";
import { Domain } from "./Domain";
import Chunk from "./structures/Chunk";
import Tile from "./Tile";

export default class Camera2D{
    static cameras : Camera2D[] = []
    private domain : Domain //connected domain
    private static count : number = 0

    id: number
    position: Vector2D = {} as Vector2D
    scale: number = 1.0 //1.0 is a 256 for tile!

    tile_size = Tile.default_size
    window_size: Vector2D = {} as Vector2D

    constructor (pos: Vector2D, size: Vector2D, init_scale: number, domain: Domain){
        this.id = Camera2D.count++
        this.position = pos
        this.window_size = size
        this.scale = init_scale
        this.tile_size = Tile.default_size * this.scale
        this.domain = domain
        Camera2D.cameras.push(this)
    }

    private adjust_tile_size() {
        this.tile_size = Tile.default_size * this.scale
    }

    getVisible(): Tile[][] {
        let y = Math.floor(this.position.y / this.tile_size)
        let borderY = y + Math.ceil(this.window_size.y / this.tile_size)
        if (borderY > this.domain.size_in_chunks.y * Chunk.chunk_size)
            borderY = this.domain.size_in_chunks.y * Chunk.chunk_size

        let x = Math.floor(this.position.x / this.tile_size)
        let borderX = x + Math.ceil(this.window_size.x / this.tile_size)
        if (borderX > this.domain.size_in_chunks.x * Chunk.chunk_size)
            borderX = this.domain.size_in_chunks.x * Chunk.chunk_size

        let visible_tiles : Tile[][] = []
        for (y; y < borderY; y++){
            let tile_row : Tile[] = []
            for (let x = Math.floor(this.position.x / this.tile_size); x < borderX; x++)
            {
                tile_row.push(this.domain
                    .chunks[Math.floor(y / Chunk.chunk_size)][Math.floor(x / Chunk.chunk_size)]
                    .tiles[y % Chunk.chunk_size][x % Chunk.chunk_size]
                )
            }

            visible_tiles.push(tile_row)
        }

        return visible_tiles
    }

    rescaleCamera(new_scale: number){
        const delta_scale = this.scale - new_scale
        this.position = Scale(this.position, delta_scale)
        this.adjust_tile_size()
        this.scale = new_scale
    }
}