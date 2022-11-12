import React, { useEffect } from "react";
import { motion, useAnimation, useAnimationControls } from "framer-motion"
import Motion, { retrieveMotionImage } from "../logic/interfaces/Motion";
import Position from "../logic/interfaces/Position";
import Field from "../logic/Field";
import Animator from "../logic/Animator";

interface EffectProps{
    motion: Motion
}

    /**
     * Despite name returns animation!
     * @param props motion - animation, position - position to render
     * @returns JSX.Element with animation
     */
export default function  Effect(props: EffectProps): JSX.Element {
    
    return(
        <motion.div
            style={{
                position: "absolute",
               
                zIndex: 2000000
            }}
            animate={props.motion.anim.animate}
            initial={props.motion.anim.initial}
            transition={props.motion.anim.transition}
            onAnimationStart={()=>{ console.warn(`animation with Id ${props.motion.id} has started`)}}
            onAnimationComplete={() => { console.warn(`animation with Id ${props.motion.id} finished`); Animator.remove(props.motion.id!)}}
        >
            <img
                src={retrieveMotionImage(props.motion.image)}
                style={{
                    position: 'absolute',
                    width: props.motion.width,
                    height: props.motion.height
                }}
                alt={props.motion.image}
            >
            </img>
        </motion.div>
    )
}