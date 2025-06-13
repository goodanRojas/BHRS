import React from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  className = '',
  ...rest
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <label
        htmlFor={name}
        className="absolute top-[7px] left-2 transform -translate-y-1/2 bg-white px-1 text-xs text-gray-500 z-10"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={type === 'file' ? undefined : value} // File input shouldn't have value
        onChange={onChange}
        required={required}

        {...rest}
        className="mt-2 w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

export default InputField;
