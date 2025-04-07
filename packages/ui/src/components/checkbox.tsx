import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
}

export const Checkbox = ({ register, ...props }: CheckboxProps) => {
  return (
    <div className="flex items-start gap-2 w-full flex-col">
      <label
        htmlFor={props.id}
        className={`text-sm font-medium ${
          props.disabled ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {props.label || ""}
      </label>
      <input
        type="checkbox"
        {...props}
        {...register?.(props.name)}
        className="w-5 h-5 border border-[#D9D9D9] rounded cursor-pointer ml-5 
        focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-black/60 transition-all duration-200 ease-in-out"
      />
    </div>
  );
};
