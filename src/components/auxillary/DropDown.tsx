import React from "react";

interface DropDownProps{
    values: string[]
    filter?: string;
    valueSelection: Function
}

export default function DropDown(props: DropDownProps): JSX.Element{

    function arrayDislay(): string[] {
        if (!props.filter) return props.values
        const regex = new RegExp(`^${props.filter}`)
        return props.values.filter(value => regex.test(value))
    }

    return(
        <div className={"dropdown"}>
            {arrayDislay().map(
                (value, index): JSX.Element => {
                    return(
                        <div
                            key={index}
                            onClick={()=>props.valueSelection(value)}
                        >
                            {value}
                        </div>
                    )
                }
            )}
        </div>
    )
}