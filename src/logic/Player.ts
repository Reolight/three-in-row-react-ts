import IItem from "../Domain/logic/interfaces/IItem"
import PlayerData from "./interfaces/PlayerData"
import PlayRecord from "./interfaces/PlayRecord"
import Score from "./Score"

export default class Player implements PlayerData {
    name: string
    money: number
    score?: Score
    records?: PlayRecord[]
    inventory: IItem[] = []

    constructor(name: string, money: number){
        this.name = name
        this.money = money
    }

    static makePlayer(data: PlayerData): Player {
        let player = new Player(data.name, data.money)
        player.records = data.records
        return player
    }

    addScore(score: number): void{
        this.score!.score += score
    }

    recordPlay(stage: string, score: number){
        let record: PlayRecord | undefined = this.records?.find(rec => rec.stage === stage)
        if (!record){
            record = {stage: stage, score: score}
            if (!this.records) this.records = []
            this.records.push(record)
        } else {
            record.score = record.score < score? score : record.score
        }
        
        this.money += Math.round(score / 4)
        this.save()
    }

    getRecord(stage: string): PlayRecord | undefined{
        return this.records?.find(rec => rec.stage === stage)
    }

    save(){
        localStorage.setItem(this.name, JSON.stringify(this))
    }

    static load(name: string): Player {
        const playerJson = localStorage.getItem(name)
        const player = playerJson? Player.makePlayer(JSON.parse(playerJson)) : new Player(name, 0)
        player.save()
        return player
    }

    payMoney(amount: number){
        this.money -= amount
    }
}