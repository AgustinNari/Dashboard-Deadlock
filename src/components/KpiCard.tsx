import { AlertTriangle, Gauge, HeartPulse, RotateCcw, Signal, Trophy } from 'lucide-react';
import { ReactNode } from 'react';
import { AlertLevel } from '../types';

const icons: Record<string, ReactNode> = {
  winrate: <Trophy size={20} />,
  abandonment: <RotateCcw size={20} />,
  crash: <AlertTriangle size={20} />,
  fps: <Gauge size={20} />,
  satisfaction: <HeartPulse size={20} />,
  return: <Signal size={20} />,
};

interface KpiCardProps {
  icon: keyof typeof icons;
  label: string;
  value: string;
  detail: string;
  signal?: string;
  level?: AlertLevel;
}

export function KpiCard({ icon, label, value, detail, signal = 'Estable', level = 'ok' }: KpiCardProps) {
  return (
    <article className={`kpi-card ${level}`}>
      <div className="kpi-card-top">
        <div className="kpi-icon">{icons[icon]}</div>
        <span className={`status-pill ${level}`}>{signal}</span>
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}
