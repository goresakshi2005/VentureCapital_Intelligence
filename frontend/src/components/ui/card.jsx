import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`rounded border bg-white ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-4 py-2 border-b ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <div className={`font-semibold ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default Card;
