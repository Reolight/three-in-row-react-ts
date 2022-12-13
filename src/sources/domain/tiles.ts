import ITileDefinition from "../../Domain/logic/interfaces/ITileDefinition";
import Tile from "../../Domain/logic/Tile";
import DomainSource from "./DomainSource";

const tiles_array_source : ITileDefinition[] = [
    {
        name: 'grass',
        surface_image: 'grass_tile.png',
        height_image: 'htgrass.png',
        tile_type: "ground"
    } as ITileDefinition,
    {
        name: 'road',
        surface_image: 'road_tile.png',
        height_image: 'htrock.png',
        tile_type: "ground"
    } as ITileDefinition
]

export function getDomainTile(name: string, surface_only: boolean = false): Tile | undefined{
    const tile_def = tiles_array_source.find(tile => tile.name === name)
    if (tile_def){
        const tile : Tile = {
            name: tile_def.name,
            surf_image: DomainSource.LoadTile(tile_def.surface_image),
            depth_image: DomainSource.LoadTileBack(tile_def.height_image),
            tile_type: tile_def.tile_type
        } as Tile

        return tile
    }

    return
}