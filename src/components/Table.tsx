import React, { useEffect, useState } from "react";
import Field from "../logic/Field";
import Position from "../logic/interfaces/Position";
import Player from "../logic/Player";
import Score from "../logic/Score";
import CellView from "./CellView";
import UITable from "./UITable";

interface gameInfoProps{
    stage: string
    player: Player
}
//Просто куча пометок для меня на русском, потому что я разраб и мне можно
//Цикл должен строится на следующем: совпадения > разрушение > падение
//повторяется каждый раз после клика или  генерации новой карты. Делай. Досвидания.

export default function Table(props : gameInfoProps){
    const MATCH = 0
    const DESTROY = 1;
    const FALL = 2
    const FREE = 3 //maybe I should make state COMPLETED?

    const [field, setField] = useState<Field>()
    const [state, setState] = useState<number>()
    const [player, setPlayer] = useState(props.player)
    //const [completed, setCompleted] = useState(false)

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
        swapped = []
        const [f, money] = Field.DestroyChains(field!)
        player.addScore(money)
        setPlayer(player)
        setField(f)
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
        player.score = stage!.score //ref to score
        setField(stage)
        console.debug(`state set to MATCH`)
        setState(MATCH)
    }

    function Free(){
        player.score!.step++
        if (swapped.length == 2) {
            swap(true)
        }
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
            default: console.debug("nothing launched")
        }
    }

    let swapped: Position[] = []
    function swap(revert: boolean = false){
        const f = field!
        if (f.cells[swapped[0].y][swapped[0].x].swap(f.cells[swapped[1].y][swapped[1].x])) {
            if (revert) swapped = []
            setField(f)
            setState(MATCH)
        } else swapped = []
    }

    function onClicked(pos: Position){
        console.debug(`Clicked : ${pos.toString()}`)
        if (swapped.length == 1 &&
            !Position.isAdjacent(swapped[0], pos))
            swapped[0] = pos
        else swapped.push(pos)
        
        if (swapped.length == 0) swapped.push(pos)

        if (swapped.length == 2){
            swap()
        }
    }

    return(!field? <p>Wait please...</p> :
        <div className="Game-container">
            <UITable player={player} goal={field!.goal}/>
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