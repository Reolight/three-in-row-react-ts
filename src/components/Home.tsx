import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../App";
import Player from "../logic/Player";
import DropDown from "./auxillary/DropDown";
import "./styles/panel.css"

export default function Home() {
    const {player, setPlayer} = useContext(PlayerContext)
    const [showDropdown, setShowDropdown] = useState(false)
    const [name, setName] = useState("")
    const [names, setNames] = useState<string[]>([""])
    const navigate = useNavigate()

    function init(){
        const namesJson = localStorage.getItem("players")
        let n = namesJson? JSON.parse(namesJson) : [""]
        setNames(n)
    }

    useEffect(init, [])
    useEffect(() => player && navigate(`Menu/${player!.name}`), [player, navigate])

    function navigateTo(){
        if (name.length<4){
            alert('Too short name! Must be more than 4 symbols')
            return
        }

        if (!names.find(n => n === name))
            localStorage.setItem("players", JSON.stringify([...names, name]))
        setPlayer(Player.load(name))
    }

    function onChangeInputValidation(e: React.ChangeEvent<HTMLInputElement>){
        const name_rules = new RegExp(`[^a-zA-Zа-яА-ЯёЁ0-9_]`)
        if (name_rules.test(e.target.value)) return
        setName(e.target.value)
    }

    function onSelect(name: string){
        setName(name)
        setShowDropdown(false)
    }

    return(
        <div className="Panel">
            <h3>Enter your name</h3>
            <div className="Menu-row align-items-center">
                <div className="w-fit-content relative" >
                    <input 
                        type="text" 
                        value={name}
                        onChange={onChangeInputValidation}
                        onFocus={() => {setShowDropdown(true);}}
                    />
                    {showDropdown && <DropDown
                        values={names}
                        valueSelection={onSelect}
                        filter={name}
                    />}
                </div>
                <button onClick={navigateTo}>
                    Enter
                </button>
            </div>
        </div>
    )
}