interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    register?: any;
}
// TODO: handle error state
export const Input = ({register, ...props}: InputProps) => {
  return (
    <div className="flex flex-col items-start gap-2 f-full">
      <label htmlFor={props.id} className="text-black text-base">
        {props.label || ""}
      </label>
      <input
        {...props}
        {...register(props.name)}
        className={`w-full input grow text-base text-black placeholder-gray-light font-normal ring-0 outline-none bg-white border border-[#D9D9D9] rounded-2 ${props.className || ""}`}
      />
    </div>
  );
};
