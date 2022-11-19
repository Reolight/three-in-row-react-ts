//This file contains conditions for effect.
//file is separated from effect description to make Effects.ts file is a little bit lightier

import { chain_info, effect_conditions } from "../../logic/interfaces/Conditions";
import Effect from "../../logic/interfaces/Effect";
import getEffect from "./Effects";

function formConditionsMetArray(condition: chain_info) : effect_conditions[] {
    let met : effect_conditions[] = []
    conditions.forEach(cond => {
        if (((cond.chain_type && cond.chain_type.findIndex(t=>t===condition.chain_type)>= 0) || !cond.chain_type) &&
            ((!cond.max_number_in_chain && !cond.min_number_in_chain && 
                cond.exact_number_in_chain && cond.exact_number_in_chain === condition.number_in_chain ) ||
            (cond.min_number_in_chain && condition.number_in_chain >= cond.min_number_in_chain && !cond.max_number_in_chain) ||
            (cond.max_number_in_chain && condition.number_in_chain <= cond.max_number_in_chain && !cond.min_number_in_chain) ||
            (cond.max_number_in_chain && cond.min_number_in_chain && condition.number_in_chain >= cond.min_number_in_chain &&
                condition.number_in_chain <= cond.max_number_in_chain) ||
            (!cond.exact_number_in_chain && !cond.min_number_in_chain && !cond.max_number_in_chain)) &&
            ((cond.orientation && cond.orientation.findIndex(o=>o===condition.orientation)>=0) || !cond.orientation))
            
            met.push(cond)
    })

    return met
}

function getConditionWithHigherPriority(met: effect_conditions[]): effect_conditions{
    let priority : number = 0
    met.forEach(cond => {
        if (cond.priority > priority) priority = cond.priority
    });

    return met.find(cond => cond.priority === priority)!
}

export default function resolveConditions(condition: chain_info): Effect | undefined {
    let met : effect_conditions[] = formConditionsMetArray(condition)
    console.debug(met)
    if (met && met.length > 0) return getEffect(getConditionWithHigherPriority(met).effect_name)
        else return
}

/**
 * Here is an array of conditions under which effects are raised
 */
const conditions: effect_conditions[] = [
    {
        effect_name: "sprite",
        priority: 10,
        exact_number_in_chain: 4,
        orientation: ['h', 'v']
    },

    {
        effect_name: "bomb",
        priority: 11,
        min_number_in_chain: 5,
        orientation: ["n"]
    },

    {
        effect_name: "unicolor",
        priority: 12,
        min_number_in_chain: 5,
        orientation: ['h', 'v']
    }
]