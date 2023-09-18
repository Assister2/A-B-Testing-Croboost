import React, { useState } from "react";

const Selection = ({
  options,
  defaultOption,
  label,
  onChange,
  className = "",
}) => {
  const [selectedOption, selectOption] = useState(defaultOption || null);

  return (
    <div className={`my-2 flex flex-col ${className}`}>
      <label className="text-label text-sm mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={`p-2 cursor-pointer border-2 rounded-md ${
              selectedOption === option.value
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => {
              selectOption(option.value);
              onChange(option.value);
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Selection;
