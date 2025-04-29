interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  error?: string;
}

export const Input = ({ register, error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <label
        htmlFor={props.id}
        className={`text-base ${
          props.disabled ? "text-gray-400" : "text-black"
        }`}
      >
        {props.label || ""}
      </label>
      <input
        {...props}
        {...register?.(props.name)}
        className={`w-full input grow text-base placeholder-gray-light font-normal ring-0 outline-none bg-white border rounded-2
          ${error ? "border-red-500" : "border-[#D9D9D9]"}
          ${props.className || ""}
          disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed`}
      />
      {error && <p className="self-end text-red-500 text-xs">{error}</p>}
    </div>
  );
};
