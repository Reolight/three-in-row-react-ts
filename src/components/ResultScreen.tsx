import React from "react";
import Score from "../logic/Score";

interface ResultScreenProps{
    isWon: boolean
    score: Score
}

export default function ResultScreen(props: ResultScreenProps): JSX.Element{

    function Win() : JSX.Element{
        return (
            <div className="flex flex-col">
                <h1 className="win">STAGE COMPLETED</h1>
                <h5>{`Score: ${props.score.score}`}</h5>
                <h5>{`Steps: ${props.score.step}`}</h5>
                <div className="flex flex-row">
                    <button className="flex next">Next</button>
                    <button className="flex retry">Retry</button>
                </div>
            </div>
        )
    }

    function Lost() : JSX.Element{
        return(
            <div>
                <h1 className="defeat">DEFEATED</h1>
                <h5>{`Score: ${props.score.score}`}</h5>
                <h5>{`Steps: ${props.score.step}`}</h5>
                <div className="flex flex-row">
                    <button className="flex next">Menu</button>
                    <button className="flex retry">Retry</button>
                </div>
            </div>
        )
    }

    return (
        <div className="result">
            {props.isWon? Win() : Lost()}
        </div>
    )
}