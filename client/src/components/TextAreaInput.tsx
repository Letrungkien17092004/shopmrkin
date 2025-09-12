import React from "react";


type TextAreaInutProps = {
    labelName: string,
    textareaName: string,
    textareaId: string,
    defaultInp?: string,
    placeholder?: string,
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}
export default function TextAreaInput({labelName, textareaName, textareaId, defaultInp, placeholder, onChange}: TextAreaInutProps) {
    return (<>
        <div className="w-full pad-12px">
            <label className="field-label text-base font-bold">{labelName}</label>
            <textarea onChange={onChange} defaultValue={defaultInp} placeholder={placeholder} name={textareaName} id={textareaId} className="text-base font-normal area-field"></textarea>
        </div>
    </>)
}