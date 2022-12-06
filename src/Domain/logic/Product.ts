import Player from "../../shared/Player"
import IItem from "./interfaces/IItem"

export default class Product{
    name: string
    image?: string
    price: number
    rarity: number
    count: number
    item: IItem

    constructor (name: string, im: string, price: number, item: IItem, rarity: number, count: number){
        this.image = im
        this.name = name
        this.price = price
        this.item = item
        this.rarity = rarity
        this.count = count
    }

    buy(player: Player){

    }

    buyCount(count: number, player: Player): IItem {
        player.payMoney(this.price * count)
        const clone = require('rfdc/default')
        let result = clone(this.item) as IItem
        result.count = count
        return result
    }
}