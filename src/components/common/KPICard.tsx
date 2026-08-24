import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';
import CountUp from './CountUp';
import InfoTooltip from './InfoTooltip';

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: number; // magnitude, e.g. 3
  trendDirection?: 'up' | 'down'; // up = risk increased (bad, red), down = risk decreased (good, green)
  icon?: ReactNode;
  accentColor?: string;
  demo?: boolean;
  tooltip?: string;
  sparkline?: number[];
  navigateTo?: string;
  navigateFilter?: Record<string, string>;
}

export default function KPICard({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendDirection,
  icon,
  accentColor = '#2563eb',
  demo,
  tooltip,
  sparkline,
  navigateTo,
}: Props) {
  const navigate = useNavigate();
  const trendGood = trendDirection === 'down';
  const clickable = !!navigateTo;
  const isNumeric = typeof value === 'number';

  return (
    <div
      className="card"
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => navigate(navigateTo!) : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(navigateTo!);
            }
          : undefined
      }
      style={{
        cursor: clickable ? 'pointer' : undefined,
        transition: 'border-color 0.15s ease, transform 0.1s ease',
      }}
      onMouseEnter={(e) => {
        if (clickable) e.currentTarget.style.borderColor = accentColor;
      }}
      onMouseLeave={(e) => {
        if (clickable) e.currentTarget.style.borderColor = 'var(--bg-border)';
      }}
    >
      {demo && (
        <span className="demo-badge">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sev-medium)' }} />
          Demo data
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          {title}
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        {icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: `${accentColor}1a`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="kpi-value">
        {isNumeric ? <CountUp value={value as number} /> : value}
        {unit && <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: 4 }}>{unit}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        {trend !== undefined && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              background: trendGood ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: trendGood ? 'var(--sev-low)' : 'var(--sev-critical)',
            }}
          >
            {trendDirection === 'up' ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {trend}
            {typeof trend === 'number' && trend < 100 ? 'pts' : ''}
          </span>
        )}
        {subtitle && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
      {sparkline && sparkline.length > 1 && (
        <svg width="100%" height={28} viewBox="0 0 100 28" preserveAspectRatio="none" style={{ marginTop: 10, display: 'block' }}>
          <polyline
            points={sparkline
              .map((v, i) => {
                const min = Math.min(...sparkline);
                const max = Math.max(...sparkline);
                const range = max - min || 1;
                const x = (i / (sparkline.length - 1)) * 100;
                const y = 26 - ((v - min) / range) * 24;
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke={accentColor}
            strokeWidth={1.6}
            opacity={0.8}
          />
        </svg>
      )}
    </div>
  );
}
