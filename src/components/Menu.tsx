import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getStageNames } from "../sources/data/Scenes";
import StageInfo from "./StageInfo";

export default function Menu(){
    const stages: string[] = getStageNames()
    const [chosen, setChosen] = useState<number>(-1)

    return(
        <div className="Menu-row">
            <div className="App Panel flex">
                <h1>Stage menu</h1>
                <h3>Choose stage to continue</h3>
                <div className="List-div">
                    {stages.map((stage, index)=>{ return(
                        <button
                            className="Panel-button"
                            key={index}
                            onClick={() => chosen == index? setChosen(-1): setChosen(index)}
                        >
                            <p>{index + 1}: {stage}</p>
                        </button>
                    )})}
                </div>
            </div>
            <div className="flex flex">
                <StageInfo name={stages[chosen]} />
            </div>
        </div>
    )
}