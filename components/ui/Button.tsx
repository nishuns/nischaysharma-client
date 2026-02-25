import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'minimal';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={`btn btn--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
