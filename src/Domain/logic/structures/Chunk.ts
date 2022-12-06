import { getDomainTile } from "../../../sources/domain/tiles";
import { Vector2D } from "../auxillary/vectors";
import Tile from "../Tile";

export default class Chunk{
    private static chunk_size : Vector2D = { x: 16, y: 16}
    chunk_offset: Vector2D = {x: 0, y: 0} //def offset. 
    tiles: Tile[][] = []

    static def_init(offset: Vector2D): Chunk{
        let chunk : Chunk = {} as Chunk
        chunk.chunk_offset = offset
        for (let y = 0; y < Chunk.chunk_size.y; y++){
            let tile_row: Tile[] = []
            for (let x = 0; x < Chunk.chunk_size.x; x++){
                const tile : Tile = getDomainTile("grass")! //should be generation later...
                tile.position = {
                    x: offset.x * Chunk.chunk_size.x + x,
                    y: offset.y * Chunk.chunk_size.y + y
                }

                tile_row.push(tile)
            }

            chunk.tiles.push(tile_row)
        }

        return chunk
    }
}