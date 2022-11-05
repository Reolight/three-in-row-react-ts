import React from "react";
import Score from "../logic/Score";
import "./styles/result.css"

interface ResultScreenProps{
    isWon: boolean
    score: Score
    retry: () => void
    menu: () => void
}

export default function ResultScreen(props: ResultScreenProps): JSX.Element{

    function Win() : JSX.Element{
        return (
            <div className="flex flex-col">
                <h1 className="win">STAGE COMPLETED</h1>
                <h5>{`Score: ${props.score.score}`}</h5>
                <h5>{`Steps: ${props.score.step}`}</h5>
                <div className="flex flex-row">
                    <button className="flex next" onClick={props.menu}>Continue</button>
                    <button className="flex retry" onClick={props.retry}>Retry</button>
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
                    <button className="flex next" onClick={props.menu}>Menu</button>
                    <button className="flex retry" onClick={props.retry} >Retry</button>
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