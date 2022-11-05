import Score from "../Score"
import PlayRecord from "./PlayRecord"

export default interface PlayerData{
    name: string
    money: number
    records?: PlayRecord[]
}