
import { relative } from "path";
import React, { useContext, useEffect, useRef, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { PlayerContext } from "../../App";
import Player from "../../shared/Player";
import { Scale, Vector2D } from "../logic/auxillary/vectors";
import Camera2D from "../logic/Camera2D";
import { Domain as PlayerDomain}  from "../logic/Domain";
import Tile from "../logic/Tile";
import Camera from "./Camera";

export default function DomainC(): JSX.Element {
    const params = useParams()
    const {player, setPlayer} = useContext(PlayerContext)
    const GameContainer = useRef<HTMLDivElement>(null)
    const [domain, setDomain] = useState<PlayerDomain>()

    useEffect(() => {
        const parameters = params.player;
        if (!parameters) {
            redirect("/")
            return
        }

        if (!player){
            const player_name = params.player
            if (!player_name || (player_name && player_name.length < 4)) {
                redirect("/")
                return
            }

            setPlayer(Player.load(player_name))
        }
    }, [params])

    useEffect(() => {
        if (player && !player.domain){
            player.setDomain(PlayerDomain.def_init())
        }

        setDomain(player?.domain)
        console.debug(`Player ${player?.name} has logged to his domain`)
    }, [player])

    return(
        <div ref={GameContainer}
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh'
            }}
        >
            {
                (domain && GameContainer.current)?
                <Camera
                    domain={domain}
                    height={GameContainer.current.offsetHeight}
                    width={GameContainer.current.offsetWidth}
                    is_surface={false}
                />
                :
                <p>Loading...</p>
            }
        </div>
    )
}