import React from "react";
import Camera2D from "../logic/Camera2D";
import Tile from "../logic/Tile";
import { motion }from 'framer-motion'

interface TileDrawerProps {
    tile: Tile
    camera: Camera2D
    is_surface: boolean
}
export default function TileC(props : TileDrawerProps): JSX.Element{
    return(<>
    <motion.div style={{
            position:'absolute',
            width: props.camera.tile_size,
            height: props.camera.tile_size/2
        }} 
        animate={{
            y: props.camera.getDisplayPositionY(props.tile.position!.x, props.tile.position!.y),
            x: props.camera.getDisplayPositionX(props.tile.position!.x, props.tile.position!.y)
        }}
        initial={{
            y: props.camera.getDisplayPositionY(props.tile.position!.x, props.tile.position!.y),
            x: props.camera.getDisplayPositionX(props.tile.position!.x, props.tile.position!.y)
        }}
    >
        
        <div style={{
                position: 'absolute',
                
                zIndex:2,
                transform: "scaleY(0.5)",
                transformOrigin: "top left"
            }}
        >
            <img src={props.tile.surf_image}
                style={{
                    zIndex:2,
                    width: props.camera.tile_size,
                    height: props.camera.tile_size,
                    transform: "rotate(-45deg)"
                }}
            />
        </div>
        {!props.is_surface &&
            <>
               { <img
                    src={props.tile.depth_image}
                    style={{
                        //zIndex:1,
                        position: 'absolute',
                        marginTop: props.camera.tile_size * Math.SQRT2 / 6,
                        marginLeft: -(props.camera.tile_size * Math.SQRT2 / 7),
                        width: props.camera.tile_size * Math.SQRT2 / 2,
                        height: props.camera.tile_size,
                        transformOrigin: "top left",
                        transform: `skewY(26.565deg)`
                    }}
                />}
                <img
                    src={props.tile.depth_image}
                    style={{
                        position: 'absolute',
                        marginTop: props.camera.tile_size * Math.SQRT2 / 6,
                        marginLeft: props.camera.tile_size / 2,
                        width: props.camera.tile_size * Math.SQRT2 / 2,
                        height: props.camera.tile_size,
                        transformOrigin: "top right",
                        transform: `skewY(-26.565deg)`
                    }} />
                </>
            }
        </motion.div>
        </>
    )
}