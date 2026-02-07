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
            onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
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
            borderBottom: '1px solid var(--color-gray-200)',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.5rem',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setSidebarOpen((o) => !o)}
            style={{ display: 'none', padding: '0.5rem' }}
            aria-label="Toggle menu"
          >
            <span style={{ fontSize: '1.25rem' }}>☰</span>
          </button>
          <style>{`
            @media (max-width: 768px) {
              .app-main header button { display: inline-flex !important; }
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
