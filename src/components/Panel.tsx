import { ReactNode } from 'react';

interface PanelProps {
  title: string;
  eyebrow?: string;
  description?: string;
  badge?: string;
  badgeLevel?: 'ok' | 'warning' | 'danger';
  children: ReactNode;
  className?: string;
}

export function Panel({ title, eyebrow, description, badge, badgeLevel = 'ok', children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-header">
        <div>
          {eyebrow && <span>{eyebrow}</span>}
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {badge && <strong className={`status-pill ${badgeLevel}`}>{badge}</strong>}
      </div>
      {children}
    </section>
  );
}
