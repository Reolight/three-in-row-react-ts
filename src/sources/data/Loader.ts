//I want to get rid of functions list of loader when typing code (like getWallpaper and so on)
//To do so, I incapsulate all those logic in class
export default class Loader{        
    static getWallpaper(stage_name: string, sprite_name: string): string | undefined {
        return Loader.get_image(stage_name, sprite_name, 'wall')
    }

    static getEffect(stage_name: string, effect_name: string): string | undefined{
        return Loader.get_image(stage_name, effect_name, 'effect')
    }

    static getMotion(stage_name: string, motion_name: string): string | undefined{
        return Loader.get_image(stage_name, motion_name, 'motion')
    }

    static getSprite(stage_name: string, sprite_image: string): string | undefined{
        return Loader.get_image(stage_name, sprite_image, 'sprites')
    }

    static getBack(stage_name: string, back_name: string): string | undefined{
        return Loader.get_image(stage_name, back_name, 'backs')
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

    return res
}
}