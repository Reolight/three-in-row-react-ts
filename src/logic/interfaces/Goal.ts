import Score from "../Score";

export default abstract class Goal{
    score?: Score

        //should not be overwritten. ? to get rid of neccessarity to define property init later
        //Used in Field class to init
    static init(goal: Goal, score: Score): Goal {
        goal.score = score
        return goal
    }

    isAchieved(): boolean{
        return false
    }

    isDefeated(): boolean{
        return false
    }
        //shoud be reimplemented! text in :: changes to sprites, in || to items with corresponding names
    abstract toString(): string
}