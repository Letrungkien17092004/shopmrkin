import React from "react";

type InputProps = {
    type: "text" | "email" | "number" | "password";
    placeHolder?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ type, placeHolder, defaultValue, onChange }: InputProps) {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeHolder}
                defaultValue={defaultValue}
                onChange={onChange}
                className="
                    w-full
                    px-2 py-2
                    text-base text-black
                    border border-gray-300
                    rounded-lg
                    bg-white
                    placeholder:text-gray-400
                    focus:outline-none
                    focus:border-gray-500
                    transition
                "
            />
        </div>
    );
}
