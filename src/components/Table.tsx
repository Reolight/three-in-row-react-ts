import React, { useEffect, useState } from "react";
import Field from "../logic/Field";
import CellView from "./CellView";

interface gameInfoProps{
    stage: string
    
}
//Просто куча пометок для меня на русском, потому что я разраб и мне можно
//Цикл должен строится на следующем: совпадения > разрушение > падение
//повторяется каждый раз после клика или  генерации новой карты. Делай. Досвидания.

export default function Table(props : gameInfoProps){
    const [field, setField] = useState<Field>()

    function InitialCycle(){
        const stage : Field = Field.getStage(props.stage)
        setField(Field.MatchAll(stage))
    }

    useEffect(InitialCycle, [props.stage])

    return(!field? <p>Wait please...</p> :
        <table className="Game-table">
            <tbody>
            {field.cells.map((row, y) =>
                <tr key={y}>
                    {row.map((cell, x) => cell.isExist?
                        <td className={cell.markedForDelete? "Cell-marked" : "Cell"} key={x + y/100}>
                            <CellView cell={cell} />
                        </td> : <td key={x + y/100} ></td>
                    )}
                </tr>
            )}
            </tbody>
        </table>)
}