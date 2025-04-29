import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  error?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  error,
  className,
  ...rest
}) => {
  return (
    <button
      id="continue-btn"
      type="submit"
      className={classNames(
        "btn w-full btn-primary font-normal rounded-3xl text-neutral-100 disabled:text-neutral-400 disabled:bg-neutral-200",
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
