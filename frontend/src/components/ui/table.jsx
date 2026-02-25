import React from 'react';

export function Table({ children, className = '' }) {
  return <table className={`min-w-full divide-y divide-gray-200 dark:divide-border ${className}`}>{children}</table>;
}

export function TableHeader({ children, className = '' }) {
  return <thead className={className}>{children}</thead>;
}

export function TableBody({ children, className = '' }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className = '' }) {
  return <tr className={`hover:bg-gray-50 dark:hover:bg-surface-light ${className}`}>{children}</tr>;
}

export function TableHead({ children, className = '' }) {
  return <th className={`text-left px-4 py-3 text-xs font-medium text-gray-700 dark:text-text-secondary uppercase tracking-wide ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm text-gray-600 dark:text-text-secondary ${className}`}>{children}</td>;
}

export default Table;