import React from 'react';

export function buttonVariants({ variant, size, className = '' } = {}) {
  const base = 'inline-flex items-center justify-center rounded';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-3 py-1.5';
  const variantClass = variant === 'outline' ? 'border' : 'bg-blue-600 text-white';
  return `${base} ${sizeClass} ${variantClass} ${className}`.trim();
}

export function Button({ children, className = '', variant, size, disabled, ...props }) {
  const classes = buttonVariants({ variant, size, className });
  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export default Button;
