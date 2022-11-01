export default class Position{
    x: number
    y: number

    constructor(x: number, y: number){
        this.x = x 
        this.y = y
    }

    static isAdjacent(pos1: Position, pos2: Position ): boolean {
        return (Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)) == 1
    }
}