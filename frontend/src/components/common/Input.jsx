import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3 
          text-base
          border rounded-lg 
          transition-colors duration-200
          min-h-[44px]
          ${error 
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
          }
          ${disabled 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'bg-white'
          }
          outline-none
          ${inputClassName}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-start gap-1">
          <svg 
            className="w-4 h-4 mt-0.5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Input;
