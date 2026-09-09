import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false, ...rest }: CardProps) {
  return (
    <div
      className={`bg-slate-900/50 border border-slate-800/60 rounded-2xl ${
        hoverable ? 'hover:bg-slate-800/50 hover:border-slate-700 transition-all cursor-pointer' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
