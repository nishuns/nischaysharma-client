import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'solid' | 'glass';
}

export const Input = ({ className = '', variant = 'solid', ...props }: InputProps) => {
  const baseStyles = "w-full h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 rounded-md";
  
  const variants = {
    solid: "bg-white border border-neutral-200 placeholder:text-neutral-400 focus:ring-black focus:border-transparent text-neutral-900",
    glass: "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-white/50 focus:bg-white/20"
  };

  return (
    <input
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
