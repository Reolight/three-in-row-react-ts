import Tile from "../../Domain/logic/Tile";
import clone from "../../shared/clone";
import DomainSource from "./DomainSource";

const tiles_array_source : Tile[] = [
    {
        name: 'grass',
        image: 'grass_tile.png',
        tile_type: "ground"
    } as Tile,
    {
        name: 'road',
        image: 'road_tile.png',
        tile_type: "ground"
    } as Tile,
    {
        name: 'water',
        image: 'lake_tile.png',
        tile_type: "water"
    } as Tile
]

export function getDomainTile(name: string): Tile | undefined{
    const tile = tiles_array_source.find(tile => tile.name === name)
    if (tile){
        const cloned = clone<Tile>(tile)
        if (cloned.image)
            cloned.image = DomainSource.LoadTile(tile.image!)
        return cloned
    }

    return tile
}