import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: 'primary' | 'gray' | 'green' | 'blue' | 'amber';
}

const accentStyles: Record<string, { bg: string; color: string }> = {
  primary: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  gray: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-600)' },
  green: { bg: '#D1FAE5', color: '#059669' },
  blue: { bg: '#DBEAFE', color: '#2563EB' },
  amber: { bg: '#FEF3C7', color: '#D97706' },
};

export function StatsCard({ title, value, subtitle, icon, accent = 'primary' }: StatsCardProps) {
  const style = accentStyles[accent] ?? accentStyles.primary;
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-gray-500)', fontWeight: 500 }}>
            {title}
          </p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-sm)',
              background: style.bg,
              color: style.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
