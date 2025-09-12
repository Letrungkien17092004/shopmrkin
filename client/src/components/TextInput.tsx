import React from "react";

type TextInputProps = {
    labelName: string,
    placeHolder?: string,
    defaultValue?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}


export default function TextInput({ labelName, placeHolder, defaultValue, onChange}: TextInputProps) {
    return (<>
        <div className="w-full">
            <label className="field-label text-base font-bold" htmlFor="">{labelName}</label>
            <input onChange={onChange} defaultValue={defaultValue} placeholder={placeHolder} className="text-inp-field text-base font-normal" type="text" />
        </div>
    </>)
}