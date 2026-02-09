import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        mobileOverlay={
          <div
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSidebarOpen(false);
              }
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 99,
            }}
          />
        }
      />
      <main className="app-main">
        <header
          style={{
            height: 'var(--header-height)',
            minHeight: 44,
            borderBottom: '1px solid var(--color-gray-200)',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            padding: '0 max(1.5rem, env(safe-area-inset-left)) 0 max(1.5rem, env(safe-area-inset-right))',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            className="btn btn-ghost app-menu-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar-nav"
          >
            <span style={{ fontSize: '1.25rem' }} aria-hidden>☰</span>
          </button>
          <style>{`
            @media (min-width: 769px) {
              .app-menu-toggle { display: none !important; }
            }
            @media (max-width: 768px) {
              .app-menu-toggle { display: inline-flex !important; min-width: 44px; min-height: 44px; padding: 0.75rem; }
            }
          `}</style>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
