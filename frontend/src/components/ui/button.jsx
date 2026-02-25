import React from 'react';

export function Button({ children, className = '', variant, size, disabled, ...props }) {
  const base = 'inline-flex items-center justify-center rounded';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-3 py-1.5';
  const variantClass = variant === 'outline' ? 'border' : 'bg-blue-600 text-white';
  return (
    <button className={`${base} ${sizeClass} ${variantClass} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export default Button;
