import React from 'react';

export function Checkbox({ id, checked, onCheckedChange, className = '' }) {
  const handleChange = (e) => onCheckedChange && onCheckedChange(e.target.checked);
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!checked}
      onChange={handleChange}
      className={className}
    />
  );
}

export default Checkbox;
