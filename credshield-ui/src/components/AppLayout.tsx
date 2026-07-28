import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/architecture', label: 'Architecture' },
    { to: '/demo', label: 'Live Demo' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f0' }}>
      <nav style={{ display: 'flex', gap: 24, padding: '20px 32px', borderBottom: '1px solid #222', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, marginRight: 24, fontSize: 18, color: '#fff' }}>CredShield</span>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              color: pathname === l.to ? '#D4AF37' : '#aaa',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: pathname === l.to ? 700 : 400,
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
