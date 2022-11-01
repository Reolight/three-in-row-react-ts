import React, { useEffect, useState } from "react";
import Cell from "../logic/Cell";
import Field from "../logic/Field";
import CellView from "./CellView";

interface gameInfoProps{
    stage: string
    
}

export default function Game(props : gameInfoProps){
    const [field, setField] = useState({} as Field)
    let stage : Field = {} as Field

    function init(){
        stage = Field.getStage(props.stage)
        setField(stage)
    }

    useEffect(init, [props.stage]);

    function renderCell(){

    }

    return(
        !stage? <p>Wait please...</p> :
        (<div>
            <table>
                {field.cells.map((row, y) =>
                    <tr>
                        <td>{ row.map((cell, x) => cell.isExist && <CellView cell={cell} /> )}</td>
                    </tr>
                )}
            </table>
        </div>)
    )
}