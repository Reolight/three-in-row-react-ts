import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../App";
import Field from "../logic/Field";
import Position from "../logic/interfaces/Position";
import CellView from "./CellView";
import UITable from "./UITable";

interface gameInfoProps{
    stage: string
    stage_complete_callback: (won: boolean) => void
}
//Просто куча пометок для меня на русском, потому что я разраб и мне можно
//Цикл должен строится на следующем: совпадения > разрушение > падение
//повторяется каждый раз после клика или  генерации новой карты. Делай. Досвидания.

export default function Table(props : gameInfoProps){
    const {player, setPlayer} = useContext(PlayerContext)

    const MATCH = 0
    const DESTROY = 1;
    const FALL = 2
    const FREE = 3 //maybe I should make state COMPLETED?
    const COMPLETED = 4

    const [field, setField] = useState<Field>()
    const [state, setState] = useState<number>()
    const [swapped, setSwapped] = useState<Position[]>([])
    //const [completed, setCompleted] = useState(false)

    useEffect(stateHub, [state])
    useEffect(InitialCycle, [props.stage])

    function delay(ms: number){
        return new Promise((res) => setTimeout(res, ms))
    }

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
        setSwapped([])
        const [f, points] = Field.DestroyChains(field!)
        player!.addScore(points)
        setPlayer(player)
        setField(f)
        setState(FALL)
    }

    async function Fall(){
        const [f, c] = Field.Fall(field!)
        await delay(220)
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
    
    function Free(){
        if (swapped.length == 0) player!.score!.step++
        
        if (field!.goal.isAchieved(player!.score!) || field!.goal.isDefeated(player!.score!)){
            setState(COMPLETED)
            props.stage_complete_callback(field!.goal.isAchieved(player!.score!))
        }
        
        if (swapped.length == 2) {
            swap(true)
        }
    }
    
    function InitialCycle(){
        const stage : Field = Field.getStage(props.stage)
        player!.score = stage!.score //ref to score
        player!.score!.step++
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
            case FREE:
                Free()
                break
            case COMPLETED:
                break
            default: console.debug("nothing launched")
        }
    }

    function swap(revert: boolean = false){
        const f = field!
        if (f.cells[swapped[0].y][swapped[0].x].swap(f.cells[swapped[1].y][swapped[1].x])) {
            if (revert) setSwapped([])
            setField(f)
            setState(MATCH)
        } else setSwapped([])
    }

    function onClicked(pos: Position){
        console.debug(`Clicked : ${pos.toString()}`)
        let s = swapped

        if (swapped.length == 1 &&
            !Position.isAdjacent(swapped[0], pos) || swapped.length == 0){
            setSwapped([pos])
        }

        else setSwapped([...swapped, pos])

        if (swapped.length == 2){
            swap()
        }
    }

    return(!field? <p>Wait please...</p> :
        <div className="Game-container">
            <UITable goal={field!.goal}/>
            <div className="container">
                <table className="Game-table">
                    <tbody>
                    {field.cells.map((row, y) =>
                        <tr key={y}>
                            {row.map((cell, x) => cell.isExist?
                                <td className={cell.markedForDelete? "Cell-marked" : "Cell"} key={x + y/100}>
                                    <CellView 
                                        cell={cell}
                                        clicked={onClicked}
                                        selected={swapped[0]?.x == cell.pos.x && swapped[0]?.y == cell.pos.y}
                                    />
                                </td> : <td key={x + y/100} ></td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>)
}