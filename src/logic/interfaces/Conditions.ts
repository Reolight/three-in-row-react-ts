/**
 * Chain orientation. If was a column of matched sprites, then it is a 'v', if a row - 'h'. If merged, than 'n'
 */
export type Orientation = 'v' | 'h' | 'n'

/**
 * The circumstances under which effect is raised. Chain(er) provides information implementing effect_condition
 * interface. 
 * @param effect_name  - name of effect raised upon conditions met
 * @param exact_number_in_chain - exact count of sprites in chain (like only 4 will spawn row bomb)
 * @param min_number_in_chain is a minimum count of sprites in chain which is neccessary for those effect
 * @param max_number_in_chain is a maximum count. It can be used to make range with "min_number_in_chain"
 * @param chain_type - name of sprites. If undefined, then it is not important which tile tries to call effect
 * @param priority - from two conditions achieved whichever has higher priority will be chosen.
 * Lower number means lower priority 0 < 1 < 2 < ...
 * @param orientation - chain orientation
 */
export interface effect_conditions{
    effect_name: string
    priority: number
    min_number_in_chain?: number
    exact_number_in_chain?: number
    max_number_in_chain?: number
    chain_type?: string[]
    orientation?: Orientation[]
}

/**
 * Those object are transferred from Chain(er) to Conditioner to resolve, which effect should be raised
 */
export interface chain_info{
    number_in_chain: number
    chain_type: string
    orientation: Orientation
}

/**
 * Conditions under wich stages unlock. It contains now those conditions:
 * @param money - money player should have to unlock level (not buying for now)
 * @param level_passed - name of level (stage is an alias) passed by player.
 * If player object contains record of passing specified stage, then current level will be unlocked
 * (in case of rest conditions are true, of course)
 */
export interface level_unlock_conditions{
    money: number
    level_passed: string //level name. if is passed
}