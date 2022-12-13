import React from "react";
import Camera2D from "../logic/Camera2D";
import Tile from "../logic/Tile";

interface TileDrawerProps {
    tile: Tile
    camera: Camera2D
    is_surface: boolean
}
export default function TileC(props : TileDrawerProps): JSX.Element{
    return(<>
        <div style={{
                position: 'absolute',
                top: props.camera.getDisplayPositionY(props.tile.position!.x, props.tile.position!.y),
                left: props.camera.getDisplayPositionX(props.tile.position!.x, props.tile.position!.y),
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
                        zIndex:1,
                        position: 'absolute',
                        marginTop: props.camera.getDisplayPositionY(props.tile.position!.x, props.tile.position!.y)
                            + props.camera.tile_size * Math.SQRT2 / 4,
                        marginLeft: props.camera.getDisplayPositionX(props.tile.position!.x, props.tile.position!.y),
                        width: props.camera.tile_size * Math.SQRT2 / 2,
                        height: props.camera.tile_size,
                        transformOrigin: "top left",
                        transform: `skewY(26deg)`
                    }}
                />}
                <img
                    src={props.tile.depth_image}
                    style={{
                        position: 'absolute',
                        marginTop: props.camera.getDisplayPositionY(props.tile.position!.x, props.tile.position!.y)
                            + props.camera.tile_size * Math.SQRT2 / 6,
                        marginLeft: props.camera.getDisplayPositionX(props.tile.position!.x, props.tile.position!.y) 
                            + props.camera.tile_size / 2,
                        width: props.camera.tile_size * Math.SQRT2 / 2,
                        height: props.camera.tile_size,
                        transformOrigin: "top right",
                        transform: `skewY(-26deg)`
                    }} />
                </>
            }
        </>
    )
}