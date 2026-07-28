import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ maxWidth: 800, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
      <h1 style={{ fontSize: 42, marginBottom: 16, color: '#ffffff' }}>CredShield</h1>
      <p style={{ color: '#999', fontSize: 18, marginBottom: 32, lineHeight: 1.6 }}>
        Privacy-preserving credential verification on the Midnight blockchain.
        Prove credential validity without exposing identity data, using
        Compact zero-knowledge circuits.
      </p>
      <Link
        to="/demo"
        style={{
          background: '#D4AF37',
          color: '#000',
          padding: '14px 32px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
          display: 'inline-block',
        }}
      >
        Try the Live Demo
      </Link>
    </div>
  );
}
