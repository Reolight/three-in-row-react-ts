interface keyval{
    name: string
    value: number
}

export default class Score{
    score: number = 0
    step: number = 0
    destroyed: keyval[] = []

    constructor(allowedSprites: string[]){
        allowedSprites.forEach(sprite => this.destroyed.push({name: sprite, value: 0}))
    }

    countDestroyed(sprite: string, add: number){
        this.destroyed.find(i => i.name === sprite)!.value += add
    }
}