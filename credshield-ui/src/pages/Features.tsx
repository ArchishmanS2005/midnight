import React from 'react';

const features = [
  { title: 'Compact ZK verification', body: 'Proves credential validity and secret key ownership off-chain. Secret keys never leave local memory.' },
  { title: 'Lace & 1AM wallet integration', body: 'Native Midnight DApp Connector support for proof delegation and transaction balancing.' },
  { title: 'Issuer authority & revocation', body: 'Issuers can revoke credentials on-chain while holder history stays unlinkable.' },
  { title: 'Selective disclosure', body: 'Prove eligibility without exposing raw metadata payloads.' },
];

export default function Features() {
  return (
    <div style={{ maxWidth: 900, margin: '60px auto', padding: '0 24px' }}>
      <h2 style={{ fontSize: 28, marginBottom: 32, color: '#ffffff' }}>Features & how it works</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {features.map((f) => (
          <div key={f.title} style={{ border: '1px solid #222', borderRadius: 12, padding: 24, background: '#111' }}>
            <h3 style={{ marginBottom: 8, color: '#D4AF37' }}>{f.title}</h3>
            <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6 }}>{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
