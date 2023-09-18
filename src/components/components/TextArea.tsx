import React from "react";

interface TextAreaProps {
  label: string;
  onChange: (value: string) => void;
  value: string;
  className?: string;
}

const TextArea = ({ label, onChange, value, className = "" }: TextAreaProps) => {
  return (
    <div className={`my-2 flex flex-col ${className}`}>
      <label className="text-label text-sm mb-3">{label}</label>
      <textarea
        className="border border-text-input rounded py-3 px-4 text-sm text-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextArea;
