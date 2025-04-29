import { IButtonProps } from "@/types";
import {
  useNavigate,
} from "@tanstack/react-router";
import cn from "classnames";

export default function HomeButton({className, ...props} :  IButtonProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={cn(
        "btn btn-outline w-full hover:bg-white rounded-2xl hover:border-gray-300 hover:text-gray-500",
        className
      )}
      onClick={() => navigate({ to: "/" })}
      {...props}
    >
      Return home
    </button>
  );
}
