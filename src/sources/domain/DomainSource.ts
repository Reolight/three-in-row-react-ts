import Tile from "../../Domain/logic/Tile"
import { fabric } from "fabric"

export default class DomainSource{
    private static cache: Map<string, string> = new Map()

    private static Load(name: string, folder: string): string{
        const res = require(`./${folder}/${name}`)
        if (res) DomainSource.cache.set(`${name}|${folder}`, res)
        return res
    }
    
    static LoadTile(sprite_name: string): string{
        return DomainSource.get_from_cache(`${sprite_name}|tiles`) 
            ?? DomainSource.Load(sprite_name, 'tiles')
    }

    static LoadTileBack(sprite_name: string): string{
        return DomainSource.get_from_cache(`${sprite_name}|tiles/b`)
            ?? DomainSource.Load(sprite_name, 'tiles/b')
    }

    static LoadBuilding(sprite_name: string): string{
        return DomainSource.get_from_cache(`${sprite_name}|buildings`) 
            ?? DomainSource.Load(sprite_name, `buildings`)
    }

    private static get_from_cache(key: string): string | undefined{
        if (DomainSource.cache.has(key))
            return DomainSource.cache.get(key)
        else return
    }
}