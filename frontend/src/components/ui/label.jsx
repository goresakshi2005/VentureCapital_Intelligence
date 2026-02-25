import React from 'react';

export function Label({ htmlFor, children, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm ${className}`}>
      {children}
    </label>
  );
}

export default Label;
