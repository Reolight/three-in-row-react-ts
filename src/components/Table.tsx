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
    const MATCH = 0
    const DESTROY = 1;
    const FALL = 2
    const FREE = 3

    const [field, setField] = useState<Field>()
    const [state, setState] = useState<number>()

    useEffect(stateHub, [state])
    useEffect(InitialCycle, [props.stage])

    function Match(){
        setField(Field.MatchAll(field!))
        if (field!.chains.length > 0){
            console.debug(`state set to DESTROY`)
            setState(DESTROY)
        }
        else{
            console.debug(`state set to FREE`)
            setState(FREE)
        }
    }

    function Destroy() {
        setField(Field.DestroyChains(field!))
        setState(FALL)
    }

    function Fall(){
        const [f, c] = Field.Fall(field!)
        setField(f)
        if (c > 0) {
            console.debug(`state continued as FALL`)
            setState(state! + 0.000001)
       }
        else{
            console.debug(`state set to MATCH`)
            setState(MATCH)
       }
    }

    function InitialCycle(){
        const stage : Field = Field.getStage(props.stage)
        setField(stage)
        console.debug(`state set to MATCH`)
        setState(MATCH)
    }

    function stateHub(){
        console.debug(`current state: ${state}`)
        switch (Math.floor(state!)) {
            case MATCH:
                Match()
                break
            case DESTROY:
                Destroy()
                break
            case FALL:
                Fall()
                break
            case FREE: break
            default: console.debug("nothing launched")
        }
    }

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