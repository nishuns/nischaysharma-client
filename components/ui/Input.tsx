import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'minimal';
}

export const Input = ({ className = '', variant = 'default', ...props }: InputProps) => {
  return (
    <input
      className={`input ${variant !== 'default' ? `input--${variant}` : ''} ${className}`}
      {...props}
    />
  );
};
