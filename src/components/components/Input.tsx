import type React from "react";

interface InputProps {
  label: string;
  onChange: React.Dispatch<React.SetStateAction<string>> | React.Dispatch<React.SetStateAction<number>>;
  value: string;
  type?: string;
  className?: string;
}

const Input = ({ label, onChange, value, type = "text", className = "" }: InputProps) => {
  return (
    <div className={`my-2 flex flex-col ${className}`}>
      <label className="text-label text-sm mb-3">{label}</label>
      <input
        type={type}
        className="border border-text-input rounded py-3 px-4 text-sm text-black"
        value={value}
        onChange={(e) => onChange((e.target.value as any))} // .trim()
      />
    </div>
  );
};

export default Input;
