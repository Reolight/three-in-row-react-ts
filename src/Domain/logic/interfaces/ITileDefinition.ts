import { TileType } from "../auxillary/TileType"

export default interface ITileDefinition{
    name: string
    surface_image : string
    height_image : string
    tile_type : TileType //? shoud I use this?
        //In near future may appear composite tile
        //E.g.: tile with water above!
}