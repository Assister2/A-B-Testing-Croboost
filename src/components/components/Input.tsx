import type React from "react";

interface InputProps {
  label: string;
  onChange: React.Dispatch<React.SetStateAction<string>> | React.Dispatch<React.SetStateAction<number>>;
  value: string;
  type?: string;
  placeHolder?:string;
  className?: string;
  inputClassName?: string
}

const Input = ({ label, onChange, value, type = "text", className = "", inputClassName="", placeHolder= "" }: InputProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-[10px] font-bold mb-2 text-[#727272]">{label}</label>
      <input
        type={type}
        placeholder={`${placeHolder}`}
        className={` py-1 px-2 leading-[120%] min-h-[31px] ${inputClassName}`}
        value={value}
        onChange={(e) => onChange((e.target.value as any))} // .trim()
      />
    </div>
  );
};

export default Input;
