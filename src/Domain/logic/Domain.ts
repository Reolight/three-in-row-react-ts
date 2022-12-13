import { Vector2D } from "./auxillary/vectors"
import Building from "./Building"
import Chunk from "./structures/Chunk"
import Tile from "./Tile" //should be not messed with tile in TiR game


export class Domain{
    size_in_chunks: Vector2D = {x: 1, y: 1}
    chunks: Chunk[][] = []
    buildings: Building[] = []
    
    static def_init(): Domain {
        const domain = new Domain()
        for (let c_y = 0; c_y < domain.size_in_chunks.y; c_y++){
            let row: Chunk[] = []
            for (let c_x = 0; c_x < domain.size_in_chunks.x; c_x++){
                const chunk = Chunk.def_init({x: c_x, y: c_y} as Vector2D)
                row.push(chunk)
            }

            domain.chunks.push(row)
        }

        return domain
    }

    getTile(x: number, y: number): Tile | undefined {
        const chunks = this.chunks[Math.floor(y / Chunk.chunk_size)][Math.floor(x / Chunk.chunk_size)]
        if (chunks) return chunks.tiles[y % Chunk.chunk_size][x % Chunk.chunk_size]
        return
    }

    isTileEmplty(x: number, y: number) : boolean{
        return !this.chunks[Math.floor(y / Chunk.chunk_size)][Math.floor(x / Chunk.chunk_size)]
            .tiles[y % Chunk.chunk_size][x % Chunk.chunk_size]
    }
}