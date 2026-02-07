import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/tasks', label: 'Tasks', icon: '✓' },
  { to: '/kanban', label: 'Kanban', icon: '▦' },
  { to: '/calendar', label: 'Calendar', icon: '📅' },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  mobileOverlay?: ReactNode;
}

export function Sidebar({ open = false, onClose, mobileOverlay }: SidebarProps) {
  return (
    <>
      {open && mobileOverlay}
      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-gray-200)' }}>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              Taskflow
            </span>
          </NavLink>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 1.5rem',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-gray-600)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                borderRight: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease, color 0.2s ease',
              })}
            >
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
