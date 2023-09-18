import React from "react";

const Button = ({ type="button", text, onClick, isDisabled }) => {
  return (
    <button
      className="mx-auto my-2 bg-button text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full"
      onClick={onClick}
      disabled={isDisabled}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
