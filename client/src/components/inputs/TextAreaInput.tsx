import React from "react";

type TextAreaInputProps = {
  labelName: string;
  textareaName: string;
  textareaId: string;
  defaultInp?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextAreaInput({
  labelName,
  textareaName,
  textareaId,
  defaultInp,
  placeholder,
  value,
  onChange
}: TextAreaInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={textareaId} className="text-sm font-medium text-black">
        {labelName}
      </label>

      <textarea
        name={textareaName}
        id={textareaId}
        value={value}
        defaultValue={defaultInp}
        placeholder={placeholder}
        onChange={onChange}
        className="
          w-full
          min-h-[120px]
          p-3
          rounded-lg
          border border-gray-300
          text-base text-black
          focus:outline-none
          focus:border-gray-500
          placeholder:text-gray-400
          resize-none
        "
      ></textarea>
    </div>
  );
}
