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

    /**
     * Simple cloning of position to be sure, that position is not passed by reference
     * @param new_pos - set to this position
     * @returns new instance of position
     */
    static positionChange(new_pos: Position): Position {
        return new Position(new_pos.x, new_pos.y)
    }

    toString(): string {
        return `${this.y}:${this.x}`
    }
}