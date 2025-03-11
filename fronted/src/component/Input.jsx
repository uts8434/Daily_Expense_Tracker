import React from 'react';

function Input({ label, type = 'text', name, id, placeholder, value, onChange ,onClick ,className}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block  font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        className={`w-full px-4 py-2 border rounded-lg ${className}`}
      />
    </div>
  );
}

export default Input;
