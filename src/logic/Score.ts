export default class Score{
    score: number
    destroyed: number[] = []
    collectedItems: number[] = []

    constructor(tilesCount: number, itemNumber: number){
        this.score = 0
        for (let i = 0; i < tilesCount; i++)
            this.destroyed.push(0)
        for (let j = 0; j < itemNumber; j++)
            this.collectedItems.push(0)
    }
}