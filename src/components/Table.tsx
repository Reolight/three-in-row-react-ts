import React, { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../App";
import Animator from "../logic/Animator";
import Chain from "../logic/Chain";
import Effector from "../logic/Effector";
import Field from "../logic/Field";
import {isAdjacent, Position} from "../logic/interfaces/Position";
import CellView from "./CellView";
import Effect from "./Effect";
import UITable from "./UITable";

interface gameInfoProps{
    stage: string
    stage_complete_callback: (won: boolean) => void
}

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

    /* eslint-disable */
    useEffect(stateHub, [state])
    useEffect(() => {if (swapped.length === 2) swap()} , [swapped.length])
    /* eslint-enable */
    useEffect(InitialCycle, [props.stage, player])
    useEffect(() => {(GameContainer.current && field) && Field.setOffset(
            GameContainer.current.offsetWidth, GameContainer.current.offsetHeight, 
            field?.size.x, field?.size.y)},
        [GameContainer.current?.offsetHeight, GameContainer.current?.offsetLeft, field])
    
    function delay(ms: number){
        return new Promise((res) => setTimeout(res, ms))
    }

    function Match(){
        Field.Match(field!, swapped)
        if (Chain.chains.length > 0 || field?.force_destroy){
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
        const points = field!.Destroy()
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
        console.debug("field: ", field)
        console.debug("animations: ", Animator.Animations)
        console.debug("effects: ", Effector.Effects)

        if (!field?.CheckAvailableCombinations()) {
            setField(Field.Shuffle(field!))
            delay(2500)
            setState(MATCH)
        }

        if (swapped.length === 0) player!.score!.step++
        
        if (field!.goal.isAchieved(player!.score!) || field!.goal.isDefeated(player!.score!)){
            setState(COMPLETED)
            props.stage_complete_callback(field!.goal.isAchieved(player!.score!))
        }
        
        if (swapped.length === 2) {
            swap(true)
        }
    }
    
    function InitialCycle(){
        const stage : Field = Field.getStage(props.stage)

        Effector.Effects = []

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
        if (state !== FREE) return
        console.debug(`Clicked : ${pos.toString()}`)
        
        if ((swapped.length === 1 && !isAdjacent(swapped[0], pos)) ||
            swapped.length === 0) {
                setSwapped([pos]);
                return
        }

        if (swapped.length === 1 && isAdjacent(swapped[0], pos)){
            setSwapped([...swapped, pos])
        }        
    }

    function removeAnimation(id: number): void {
        let f = field
        f?.animations.splice(f.animations.findIndex(m => m.id === id), 1)
        setField(f)
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
                        <tr key={y} style={{position: 'absolute', width: 0, height: 0}}>
                            {row.map((cell, x) => cell.isExist?
                                <td key={x + y/100}
                                    style={{
                                        position: 'absolute',
                                        marginTop: y * Field.Cell_size,
                                        marginLeft: x * Field.Cell_size,
                                        width: Field.Cell_size,
                                        height: Field.Cell_size,
                                        padding: 0,
                                        border: 'none'}}
                                >
                                    <img src={field.getBackground(cell)} alt={`${cell.sprite.id}`}/>
                                </td> : <td key={x + y/100} style={{position:'absolute',width:0,height:0}} ></td>
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
                                selected={swapped[0]?.x === sprite.position.x && swapped[0]?.y === sprite.position.y}
                            />
                            )}
                            </>
                        </div>   
                    <div style={{
                        position: 'relative',
                        width: 0,
                        height: 0
                    }}>
                        {field.animations.map((anim) => {
                            return <Effect
                            key={anim.id}
                            motion={anim}
                            removeAnim={removeAnimation}
                            />})}
                    </div>
                </>
            </div>
        </div>
        )
}