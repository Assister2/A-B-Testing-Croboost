import React from "react";

interface Dropdown {
  label: string;
  options: { value: string; label: string }[];
  defaultOption: string;
  onChange: (value: string) => void;
  className?: string;
}

const Dropdown = ({
  label,
  options = [],
  defaultOption,
  onChange,
  className = "",
}: Dropdown) => {
  return (
    <div className={`my-2 flex flex-col ${className}`}>
      <label className="text-label text-sm mb-3">{label}</label>
      <select
        className="border border-text-input rounded py-3 px-4 text-sm text-black"
        onChange={(e) => onChange(e.target.value)}
        defaultValue={defaultOption}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
