import React from 'react';

export default function Architecture() {
  return (
    <div style={{ maxWidth: 900, margin: '60px auto', padding: '0 24px' }}>
      <h2 style={{ fontSize: 28, marginBottom: 24, color: '#ffffff' }}>Architecture</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        <div style={{ border: '1px solid #222', borderRadius: 12, padding: 20, background: '#111' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: 12 }}>Public state (ledger)</h3>
          <ul style={{ color: '#aaa', fontSize: 14, lineHeight: 1.8, paddingLeft: 18 }}>
            <li>credentialState (ACTIVE/REVOKED)</li>
            <li>credentialId (32-byte hash)</li>
            <li>issuerAuthority (hashed PK)</li>
            <li>totalIssued / totalVerified counters</li>
          </ul>
        </div>
        <div style={{ border: '1px solid #222', borderRadius: 12, padding: 20, background: '#111' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: 12 }}>Private witness (local)</h3>
          <ul style={{ color: '#aaa', fontSize: 14, lineHeight: 1.8, paddingLeft: 18 }}>
            <li>secretKey (32 bytes, local memory)</li>
            <li>Un-blinded holder identity</li>
            <li>ZK witness context & nonces</li>
            <li>Off-chain proof generation</li>
          </ul>
        </div>
      </div>
      <h3 style={{ marginBottom: 12, color: '#ffffff' }}>Deployment pipeline</h3>
      <ol style={{ color: '#aaa', fontSize: 14, lineHeight: 2 }}>
        <li>Compile Compact contract → ZK proving keys</li>
        <li>Build API, CLI, UI packages</li>
        <li>Fund wallet with testnet tDUST/tNIGHT</li>
        <li>Deploy contract instance (CLI or UI)</li>
      </ol>
    </div>
  );
}
