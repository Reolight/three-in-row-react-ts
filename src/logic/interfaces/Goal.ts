import Score from "../Score";

export default abstract class Goal{
    isAchieved(score: Score): boolean{
        return false
    }

    isDefeated(score: Score): boolean{
        return false
    }
        //shoud be reimplemented! text in :: changes to sprites, in || to items with corresponding names
    abstract toString(): string
}