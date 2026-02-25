import React from 'react';

export function Textarea({ className = '', ...props }) {
  return <textarea className={`border rounded px-2 py-1 w-full ${className}`} {...props} />;
}

export default Textarea;
