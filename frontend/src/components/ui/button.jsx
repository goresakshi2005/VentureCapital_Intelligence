import React from 'react';

export function buttonVariants({ variant, size, className = '' } = {}) {
  const base = 'inline-flex items-center justify-center rounded transition-colors';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-3 py-1.5';
  let variantClass = 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary dark:hover:bg-primary-dark';
  if (variant === 'outline') variantClass = 'border border-gray-200 dark:border-border bg-transparent text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light';
  if (variant === 'ghost') variantClass = 'bg-transparent text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light hover:text-gray-900 dark:hover:text-text-primary';
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