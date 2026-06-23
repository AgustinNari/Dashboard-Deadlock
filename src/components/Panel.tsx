import { ReactNode } from 'react';

interface PanelProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, eyebrow, children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-header">
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
