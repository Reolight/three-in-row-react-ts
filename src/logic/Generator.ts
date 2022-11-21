//should be class, because stores data

import SpriteInt from "./interfaces/SpriteInt";
import randomInt from "./RandomInt";
import Sprite from "./Sprite";

export default class Generator{
    private static sprite_palette: SpriteInt[] = []
    private static calculated_chance: number = 0
    private static max_rounded_chance: number = 100
    private static threshold_specified_probs: number = 0

    static init(allowed_sprites: SpriteInt[]) {
        Generator.sprite_palette = allowed_sprites.sort((s1, s2) => {
            let a: number = s1.probability ?? 0;
            let b: number = s2.probability ?? 0;
            return (a - b)
        })
        
        let sum_of_sprites_without_defined_probability : number = 0
        let sum_of_defined_probabilities: number = 0
        Generator.sprite_palette.forEach(sprite => {
            if (sprite.probability) 
                sum_of_defined_probabilities += sprite.probability
            else 
                sum_of_sprites_without_defined_probability++
        })

        Generator.calculated_chance = Math.round((100 - sum_of_defined_probabilities) / sum_of_sprites_without_defined_probability)
        Generator.threshold_specified_probs = sum_of_sprites_without_defined_probability * Generator.calculated_chance
        Generator.max_rounded_chance = Generator.threshold_specified_probs + sum_of_defined_probabilities
        Generator.sprite_palette.forEach(sprite => {if (!sprite.probability) sprite.probability = Generator.calculated_chance})
    }

    private static async reduce_count(index: number){
        
        if (Generator.sprite_palette[index].max_count){
            Generator.sprite_palette[index].max_count!--
            if (Generator.sprite_palette[index].max_count === 0){
                const spliced : SpriteInt = Generator.sprite_palette.splice(index, 1)[0]
                Generator.max_rounded_chance -= spliced.probability!
            }
        }
    }

    /**
     * Returns sprite template for making sprite based on
     * spawn probabilities.
     * @param isInitial indicates is it initial generation. Upon this condition collectables doesn't spawn.
     * If dice rolled at collectable, item with [index = 0] will be returned
     */
    static GetRandomCalculated(isInitial: boolean = false): SpriteInt {
        const dice_dropped = randomInt(Generator.max_rounded_chance)
        if (Generator.threshold_specified_probs > dice_dropped)
            return Generator.sprite_palette[Math.floor(dice_dropped / Generator.calculated_chance)]
        else{
            let index = Math.floor(Generator.threshold_specified_probs / Generator.calculated_chance)
            let rest_chance = dice_dropped - Generator.threshold_specified_probs
            while (rest_chance >= Generator.sprite_palette[index].probability!) {
                rest_chance -= Generator.sprite_palette[index++].probability!
            }
            
            const sprite : SpriteInt = Generator.sprite_palette[!isInitial? index: 0]
            if (!isInitial) Generator.reduce_count(index)
            return (sprite)
        }
    }
}