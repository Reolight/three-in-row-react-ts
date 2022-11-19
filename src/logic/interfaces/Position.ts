export type Position = {
    x: number;
    y: number;
}

export function isAdjacent(pos1: Position, pos2: Position ): boolean {
    return (Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)) == 1
}

    /**
     * Simple cloning of position to be sure, that position is not passed by reference
     * @param new_pos - set to this position
     * @returns new instance of position
     */

export function posToString(pos: Position): string {
    return `${pos.y}:${pos.x}`
}
