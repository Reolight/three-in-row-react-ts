//I want to get rid of functions list of loader when typing code (like getWallpaper and so on)
//To do so, I incapsulate all those logic in class
export default class Loader{
    private static cache: Map<string, string>

    static getWallpaper(stage_name: string, sprite_name: string): string | undefined {
        return Loader.get_from_cache(`${stage_name}|${sprite_name}|${'wall'}`)
                ?? Loader.get_image(stage_name, sprite_name, 'wall')
    }

    static getEffect(stage_name: string, effect_name: string): string | undefined{
        return Loader.get_from_cache(`${stage_name}|${effect_name}|${'effect'}`)
            ?? Loader.get_image(stage_name, effect_name, 'effect')
    }

    static getMotion(stage_name: string, motion_name: string): string | undefined{
        return Loader.get_from_cache(`${stage_name}|${motion_name}|${'motion'}`)
            ?? Loader.get_image(stage_name, motion_name, 'motion')
    }

    static getSprite(stage_name: string, sprite_name: string): string | undefined{
        return Loader.get_from_cache(`${stage_name}|${sprite_name}|${'sprites'}`)
            ?? Loader.get_image(stage_name, sprite_name, 'sprites')
    }

    static getBack(stage_name: string, back_name: string): string | undefined{
        return Loader.get_from_cache(`${stage_name}|${back_name}|${'backs'}`)
        ?? Loader.get_image(stage_name, back_name, 'backs')
    }

    //static getAudio
    //static getMusic
    
    private static get_image(stage_name: string, sprite_name: string, folder: string)
    : string | undefined
    {
        let res : string
        try{
            res = require(`../data/levels/${stage_name}/${folder}/${sprite_name}`)
        } catch{
            res = require(`../${folder}/${sprite_name}`)
        }

        if (res) Loader.cache.set(`${stage_name}|${sprite_name}|${folder}`, res)
        return res
    }

    private static get_from_cache(key: string): string | undefined{
        if (Loader.cache.has(key))
            return Loader.cache.get(key)
        else return
    }
}