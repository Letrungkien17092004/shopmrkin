import React from "react";

type InputProps = {
    type: "text" | "email" | "number" | "password"
    placeHolder?: string,
    defaultValue?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}


export default function Input({ type, placeHolder, defaultValue, onChange }: InputProps) {
    return (<>
        <div className="w-full">
            <input onChange={onChange} defaultValue={defaultValue} placeholder={placeHolder} className="text-inp-field text-base font-normal" type={`${type}`} />
        </div>
    </>)
}