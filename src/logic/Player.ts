import Score from "./Score"

export default class Player {
    name: string
    money: number
    score?: Score
    
    constructor(name: string, money: number){
        this.name = name
        this.money = money
    }

        //score is money and score simultaneously.
        //But in future (maybe) it will be calculated separatly based on skills
    addScore(score: number): void{
        this.money += score;
        this.score!.score += score
    }
}