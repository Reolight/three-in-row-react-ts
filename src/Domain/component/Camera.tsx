import React, { useEffect, useRef, useState } from "react";
import { Vector2D } from "../logic/auxillary/vectors";
import Camera2D from "../logic/Camera2D";
import { Domain } from "../logic/Domain";
import Tile from "../logic/Tile";
import TileC from "./TileC";

interface CameraProps{
    width: number
    height: number
    domain: Domain
    is_surface: boolean
}

const cached_blocks: Map<string, string> = new Map()

export default function Camera(props: CameraProps) {
    const [camera, setCamera] = useState<Camera2D>()
    const [visible, setVisible] = useState<Tile[][]>()

    useEffect(() => {
        setCamera(new Camera2D({x: 0, y: 0} as Vector2D,
            {x: props.width, y: props.height} as Vector2D,
            Camera2D.adjustCameraScale(12, props.width), props.domain!
        ))
    }, [props.domain])

    useEffect(() => {
        if (camera) {
            console.debug(`Camera at ${camera.position.x}:${camera.position.y}, scale: ${camera.getScale()}`)
            const visible = camera?.getVisible()
            console.debug(`Domain: `, props.domain)
            console.debug(`Visible by ID${camera.id}: `, visible)
            setVisible(visible)
        }
    }, [camera, camera?.position])

    return(<>
        {(visible && camera)? 
        visible.map(row => 
            row.map(tile => <>
                <TileC
                    camera={camera}
                    tile={tile}
                    key={`${tile.position?.x}+${tile.position?.y}`}
                    is_surface={false}
                />
            </>)
        ): <p>Loading...</p>}
        </>
    )
}