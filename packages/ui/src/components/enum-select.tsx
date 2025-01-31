import React from "react";
import { EnumLike } from "zod";

interface EnumSelectProps<T = EnumLike>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  enumValues: T;
  register?: any;
}

export const EnumSelect = <T extends EnumLike>({
  label,
  enumValues,
  register,
  ...props
}: EnumSelectProps<T>) => {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <label htmlFor={props.id} className="text-black text-base">
        {label || ""}
      </label>
      <select
        {...props}
        {...(register && register(props.name))}
        className={`w-full input grow text-base text-black placeholder-gray-light font-normal ring-0 outline-none bg-white border border-[#D9D9D9] rounded-2 ${props.className || ""}`}
      >
        {Object.entries(enumValues).map(([key, value]) => (
          <option key={key} value={value}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};
