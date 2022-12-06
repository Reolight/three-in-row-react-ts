import { Vector2D } from "./auxillary/vectors"

export default class Building{
    size: Vector2D
    position?: Vector2D
    name: string
    image: string
    last_access?: Date

    constructor(name: string, size: Vector2D, image: string){
        this.name = name
        this.size = size
        this.image = image
    }

    /**
     * action when clicked on building
     */
    action() {
        
    }
}