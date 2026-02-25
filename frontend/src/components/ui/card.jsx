import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-surface shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-4 py-3 border-b border-gray-100 dark:border-border-light ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <div className={`font-semibold ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default Card;