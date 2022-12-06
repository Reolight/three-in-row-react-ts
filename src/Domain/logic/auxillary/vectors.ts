export type Vector2D = {
    x: number
    y: number
}

export function Scale(vector: Vector2D, scale_val: number): Vector2D {
    return {
        x: scale_val < 0? vector.x / scale_val : vector.x * scale_val,
        y: scale_val < 0? vector.y / scale_val : vector.y * scale_val
    } as Vector2D
}