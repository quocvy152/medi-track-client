import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  helperText, 
  className = "", 
  id, 
  ...props 
}: InputProps) {
  const reactGeneratedId = React.useId();
  const inputId = id || reactGeneratedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 border rounded-xl shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500
          transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500
          ${error 
            ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20 focus:border-red-500 dark:focus:border-red-500' 
            : 'border-slate-200 dark:border-slate-700'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

export default Input; 