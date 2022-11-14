import React, { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../App";
import Animator from "../logic/Animator";
import Chain from "../logic/Chain";
import Effector from "../logic/Effector";
import Field from "../logic/Field";
import Motion from "../logic/interfaces/Motion";
import Position from "../logic/interfaces/Position";
import CellView from "./CellView";
import Effect from "./Effect";
import UITable from "./UITable";

interface gameInfoProps{
    stage: string
    stage_complete_callback: (won: boolean) => void
}
//Просто куча пометок для меня на русском, потому что я разраб и мне можно
//Цикл должен строится на следующем: совпадения > разрушение > падение
//повторяется каждый раз после клика или  генерации новой карты. Делай. Досвидания.

export default function Table(props : gameInfoProps){
    const GameContainer = useRef<HTMLDivElement>(null)
    const {player, setPlayer} = useContext(PlayerContext)

    const DELAY = 30

    const MATCH = 0
    const DESTROY = 1;
    const FALL = 2
    const FREE = 3 //maybe I should make state COMPLETED?
    const COMPLETED = 4

    const [field, setField] = useState<Field>()
    const [state, setState] = useState<number>()
    const [swapped, setSwapped] = useState<Position[]>([])
    const [motion, setMotion] = useState<Motion[]>()

    useEffect(stateHub, [state])
    useEffect(() => {if (swapped.length == 2) swap()} , [swapped.length == 2])
    useEffect(InitialCycle, [props.stage])
    useEffect(() => {(GameContainer.current && field) && Field.setOffset(
            GameContainer.current.offsetWidth, GameContainer.current.offsetHeight, 
            field?.size.x, field?.size.y)},
        [GameContainer.current?.offsetHeight, GameContainer.current?.offsetLeft])

    function delay(ms: number){
        return new Promise((res) => setTimeout(res, ms))
    }

    function Match(){
        setField(Field.MatchAll(field!))
        if (Chain.chains.length > 0){
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
        const points = Field.Destroy(field!)
        player!.addScore(points)
        setPlayer(player)
        setField(field)
        setState(FALL)
        console.debug(field?.sprites)
    }

    async function Fall(){
        const [f, c] = Field.Fall(field!)
        await delay(DELAY)
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
        console.debug("sprites: ", field?.sprites)
        console.debug("effects: ", Effector.Effects)

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

        Effector.Effects = []
        Animator.Animations = []

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

        delay(300)
    }

    function onClicked(pos: Position){
        console.debug(`Clicked : ${pos.toString()}`)
        
        if (swapped.length == 1 && !Position.isAdjacent(swapped[0], pos) ||
            swapped.length == 0) {
                setSwapped([pos]);
                return
        }

        if (swapped.length == 1 && Position.isAdjacent(swapped[0], pos)){
            setSwapped([...swapped, pos])
        }        
    }

    return(!field? <p>Wait please...</p> :
        <div className="Game-container" ref={GameContainer}>
            <UITable goal={field!.goal}/>
            <div className="container"  style={GameContainer.current ? {
                marginTop: Field.OffsetY,
                marginLeft: Field.OffsetX
            } : {margin: 0}}>
                <>
                <table className="Game-table" cellSpacing={0} >
                    <tbody>
                    {field.cells.map((row, y) =>
                        <tr key={y}>
                            {row.map((cell, x) => cell.isExist?
                                <td className={
                                    cell.markedForDelete? "Cell-marked" : "Cell"} 
                                    key={x + y/100}
                                    style={{
                                        marginTop: y * Field.Cell_size,
                                        marginLeft: x * Field.Cell_size,
                                        width: Field.Cell_size,
                                        height: Field.Cell_size,
                                        padding: 0,
                                        border: 'none'}}
                                >
                                    
                                </td> : <td key={x + y/100} ></td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className="items"><>
                {field.sprites.map((sprite, x) => sprite &&
                            <CellView 
                                key={sprite.id}
                                sprite={sprite}
                                clicked={onClicked}
                                selected={swapped[0]?.x == sprite.position.x && swapped[0]?.y == sprite.position.y}
                            />
                )}
                     </>
                </div>
                </>
            </div>
        </div>
        )
}