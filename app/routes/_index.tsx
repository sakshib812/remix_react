import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'SecureShield Test Website - Remix / React Router' },
    { name: 'description', content: 'Remix v2 / React Router canonical test application' },
  ];
};

export default function Index() {
  return (
    <div className="container">
      <div className="card">
        <div className="badge">Framework 07 / 14</div>
        <h1>SecureShield Test Website - Remix / React Router</h1>
        <p className="subtitle">Remix v2 Vite Plugin Fullstack Flat Routes Architecture.</p>

        <div className="meta-grid">
          <div className="meta-item">
            <span className="label">Framework Mode:</span>
            <span className="value">React Router v7 / Remix v2</span>
          </div>
          <div className="meta-item">
            <span className="label">Boundary Integrity:</span>
            <span className="value success">IS_SECURE</span>
          </div>
        </div>

        <div className="secureshield-status-box">
          <h3>🛡️ SecureShield Protection Status</h3>
          <p>Remix Client Wrapper ready: <code>app/providers/SecurityProvider.tsx</code> mounts in root.tsx.</p>
        </div>
      </div>
    </div>
  );
}
