import React, { useEffect, useState } from "react";
import { motion, useAnimation, useAnimationControls } from "framer-motion"
import Motion, { retrieveMotionImage } from "../logic/interfaces/Motion";

interface EffectProps{
    motion: Motion
    removeAnim: Function
}

    /**
     * Despite name returns animation!
     * @param props motion - animation, position - position to render
     * @returns JSX.Element with animation
     */
export default function  Effect(props: EffectProps): JSX.Element {
    const [mot] = useState(props.motion)

    return(<>
        <p id={`${mot.id}`}></p>
        <motion.img
            variants={mot.anim}
            animate={"animate"}
            initial={"initial"}
            transition={mot.anim.transition}
            onAnimationStart={()=>{ console.warn(`animation with Id ${mot.id} has started`)}}
            onAnimationComplete={() => { 
                console.warn(`animation with Id ${mot.id} finished`); 
                props.removeAnim(mot.id)
            }}
        
            src={mot.image}
            style={{
                position: 'absolute',
                width: mot.width,
                height: mot.height,
            }}
            alt={mot.image}
        />
    </>)
}