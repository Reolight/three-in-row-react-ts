import { Vector2D } from "./auxillary/vectors"
import Building from "./Building"
import Chunk from "./structures/Chunk"
import Tile from "./Tile" //should be not messed with tile in TiR game


export default class Domain{
    size: Vector2D = {x: 1, y: 1}
    chunks: Chunk[][] = []
    buildings: Building[] = []
    
    static def_init(): Domain {
        const domain = new Domain()
        for (let c_y = 0; c_y < domain.size.y; c_y++){
            let row: Chunk[] = []
            for (let c_x = 0; c_x < domain.size.x; c_x++){
                const chunk = Chunk.def_init({x: c_x, y: c_y} as Vector2D)
                row.push(chunk)
            }

            domain.chunks.push(row)
        }

        return domain
    }
}