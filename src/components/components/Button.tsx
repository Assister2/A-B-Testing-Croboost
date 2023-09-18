import type React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
}

const Button = ({ type="button", text, onClick, isDisabled }: ButtonProps) => {
  return (
    <button
      className="mx-auto my-2 bg-button text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full"
      onClick={type === "button" ? onClick : undefined}
      disabled={isDisabled}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
