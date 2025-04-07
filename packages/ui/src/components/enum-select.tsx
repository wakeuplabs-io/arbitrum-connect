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
      <label htmlFor={props.id} className="text-sm font-medium text-gray-500">
        {label || ""}
      </label>
      <div className="relative w-full">
        <select
          {...props}
          {...(register && register(props.name))}
          className={`w-full input grow text-base text-black placeholder-gray-light font-normal bg-white border border-[#D9D9D9] rounded-2 appearance-none pr-10 px-3 py-2
          focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-black/60 transition-all duration-200 ease-in-out
          ${props.className || ""}`}
        >
          {Object.entries(enumValues).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
          <svg
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
