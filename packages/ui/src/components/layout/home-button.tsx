import {
  useNavigate,
} from "@tanstack/react-router";
import cn from "classnames";

interface HomeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const HomeButton: React.FC<HomeButtonProps> = ({ className, ...props }) => {
  const navigate = useNavigate();
  return (
      <button
        type="button"
        className={cn("btn btn-outline w-full hover:bg-white rounded-2xl hover:border-gray-300 hover:text-gray-500", className)}
        onClick={() => navigate({ to: "/" })}
        {...props}
      >
        Return home
      </button>
  );
}

export default HomeButton;