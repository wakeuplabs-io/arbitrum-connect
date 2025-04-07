interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  error?: string;
}

export const Input = ({ register, error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <label
        htmlFor={props.name}
        className={`text-sm font-medium ${
          props.disabled ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {props.label || ""}
      </label>
      <input
        {...props}
        id={props.name}
        {...register?.(props.name)}
        className={`w-full input grow text-base placeholder:text-gray-400 placeholder:text-sm font-normal bg-white border rounded-2 px-3 py-2
          ${error ? "border-red-500" : "border-[#D9D9D9]"}
          ${props.className || ""}
          disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed
          focus:outline-none focus:ring-1 focus:ring-black/10 focus:border-black/60 transition-all duration-200 ease-in-out`}
      />
      {error && <p className="self-end text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
