import React, { useState } from "react";
import Field from "../logic/Field";
import CellView from "./CellView";

interface gameInfoProps{
    stage: string
    
}

export default function Game(props : gameInfoProps){
    let stage : Field = Field.getStage(props.stage)
    const [field, setField] = useState(stage)

    console.log(stage)
    return(
        !stage? <p>Wait please...</p> :
        (<div className="Game-container">
            <h1>Table</h1>
            <table className="Game-table">
                <tbody>
                {field.cells.map((row, y) =>
                    <tr key={y}>
                        { row.map((cell, x) => cell.isExist?
                            <td className="Cell" key={x + y/100}>
                                <CellView cell={cell} />
                            </td> : <td key={x + y/100} ></td>)}
                    </tr>
                )}
                </tbody>
            </table>
        </div>)
    )
}