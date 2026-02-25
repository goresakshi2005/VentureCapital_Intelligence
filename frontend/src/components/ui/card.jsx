import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <div className={`font-semibold ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default Card;
