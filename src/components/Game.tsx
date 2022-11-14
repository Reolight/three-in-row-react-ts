import React, { useContext, useEffect, useState } from "react";
import { redirect, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PlayerContext } from "../App";
import Animator from "../logic/Animator";
import Motion from "../logic/interfaces/Motion";
import Player from "../logic/Player";
import Score from "../logic/Score";
import Effect from "./Effect";
import ResultScreen from "./ResultScreen";
import Table from "./Table"

interface gameInfoProps{
    stage: string
    player: Player
}

export default function Game(props : gameInfoProps){
    const navigate = useNavigate()
    const params = useParams()
    const [stage, setStage] = useState<string>()
    
    const {player, setPlayer } = useContext(PlayerContext)
    const [isCompleted, setCompleted] = useState<"WON" | "LOST" | "PLAY">("PLAY")

    const [motions, setMotions] = useState<Motion[]>()
    useEffect(() => {if (Animator.Animations) setMotions(Animator.Animations)},
        [Animator.Animations])

    useEffect(() => {
        const parameters = params.stage;
        if (!parameters) {
            redirect("/")
            return
        }

        const p = parameters.split('&')
        console.debug(`url: ${parameters}. Splitted in [${p[0]}] and [${p[1]}]`)
        setStage(p[0])
        if (!player){
            if (p[1].length < 4){
                redirect("/")
                return
            }

            setPlayer(Player.load(p[1]))
        }
    }, [params])
    
    function Won(){
        player!.recordPlay(stage!, player!.score!.score)
        setCompleted("WON")
    }

    function Completed(isWon: boolean): void {
        if (isWon) Won()
        else setCompleted("LOST")
        setPlayer(player!)
    }

    function retry(){
        player!.money -= Math.round(player!.score!.score / 4 * 3)
        setPlayer(player)
        window.location.reload()
    }

    function toMenu(){
        player!.score! = {} as Score
        setPlayer(player)
        navigate(-1)
    }

    return(!stage? <p>Loading...</p>:
    <div>
        <>
            <Table 
                stage={stage}
                stage_complete_callback={Completed}
            />
            {motions && motions.map((anim) =>{
                        <Effect
                            key={anim.id}
                            motion={anim}
                        />
                    })}
        </>
        {isCompleted !== "PLAY" && 
            <ResultScreen 
                isWon={isCompleted === "WON"} 
                score={player!.score!}
                menu={toMenu}
                retry={retry} 
            />
        }
            
    </div>)
}