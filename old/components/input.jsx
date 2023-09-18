import React from "react";

const Input = ({ label, onChange, value, type = "text", className = "" }) => {
  return (
    <div className={`my-2 flex flex-col ${className}`}>
      <label className="text-label text-sm mb-3">{label}</label>
      <input
        type={type}
        className="border border-text-input rounded py-3 px-4 text-sm text-black"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
      />
    </div>
  );
};

export default Input;
