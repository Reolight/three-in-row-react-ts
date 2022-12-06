
import { relative } from "path";
import React, { useContext, useEffect, useRef, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { PlayerContext } from "../../App";
import Player from "../../shared/Player";
import { Scale, Vector2D } from "../logic/auxillary/vectors";
import Camera2D from "../logic/Camera2D";
import { Domain as PlayerDomain}  from "../logic/Domain";
import Tile from "../logic/Tile";

export default function DomainC(): JSX.Element {
    const params = useParams()
    const {player, setPlayer} = useContext(PlayerContext)
    const GameContainer = useRef<HTMLDivElement>(null)
    const [domain, setDomain] = useState<PlayerDomain>()
    const [camera, setCamera] = useState<Camera2D>()
    const [visible_domain, setVisibleDomain] = useState<Tile[][]>()

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

    useEffect(() => {
        if (!domain) return
        setCamera(new Camera2D({x: 0, y: 0} as Vector2D,
            {x: GameContainer.current?.offsetWidth, y: GameContainer.current?.offsetHeight} as Vector2D,
            1.0, domain!
        ))
    }, [domain])

    useEffect(() => {
        if (camera) {
            const visible = camera?.getVisible()
            console.debug(`Domain: `, domain)
            console.debug(`Visible: `, visible)
            setVisibleDomain(visible)
        }
    }, [camera, camera?.position])

    return(
        <div ref={GameContainer}
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh'
            }}
        >
            {
                (camera && visible_domain)?
                visible_domain.map((row => {
                    return (<>
                        {row.map((tile) => {
                            return (
                                <img key={`${tile.position!.x}${tile.position!.y}`}
                                    src={tile.image}
                                    alt={tile.name}
                                    style={{
                                        position: 'absolute',
                                        marginTop: (tile.position!.y * Tile.default_size * camera.scale) - camera.position.y,
                                        marginLeft: (tile.position!.x * Tile.default_size * camera.scale) - camera.position.x,
                                        width: Tile.default_size * camera.scale,
                                        height: Tile.default_size * camera.scale                                        
                                    }}
                                />
                            )
                        })}
                    </>)
                }))
                :
                <p>Loading...</p>
            }
        </div>
    )
}