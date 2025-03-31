import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  error?: boolean;
  position?: "standalone" | "left" | "right" | "middle";
};

const Button: React.FC<ButtonProps> = ({
  children,
  error,
  className,
  position = "standalone",
  ...rest
}) => {
  const borderStyles = {
    standalone: "rounded-3xl",
    left: "rounded-l-3xl rounded-r-none",
    right: "rounded-r-3xl rounded-l-none",
    middle: "rounded-none",
  };

  return (
    <button
      type="submit"
      className={classNames(
        "btn w-full btn-primary font-normal text-neutral-100 disabled:text-neutral-400 disabled:bg-neutral-200",
        borderStyles[position],
        { "animate-shake": error },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
