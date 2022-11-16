import Effect from "./Effect"

export default interface Tile{
    isExist : boolean
    isBlocked : boolean //items can not be placed here, it is like an obstacle
    isFrozen : boolean  //can be here but cant be moved out
    effects? : Effect[]
}