import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export const WalletPage: React.FC = () => {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await connect(secretKey);
      setSecretKey('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '1.8rem', textAlign: 'center' }}>
        Stellar Wallet Management
      </h1>

      {connected && publicKey ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Status:</span>
            <span className="chip" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#a7f3d0' }}>
              Connected
            </span>
          </div>

          <div style={{ wordBreak: 'break-all' }}>
            <strong>Public Key:</strong>
            <p style={{ marginTop: '5px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              {publicKey}
            </p>
          </div>

          <div>
            <a
              href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                textAlign: 'center',
                width: '100%',
                marginBottom: '10px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid var(--primary)',
                color: '#fff'
              }}
            >
              View on Stellar Explorer
            </a>
            <button
              onClick={disconnect}
              style={{ width: '100%', background: 'var(--danger)' }}
              id="btn-disconnect-page"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConnect} id="wallet-connect-form-page">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', textAlign: 'center' }}>
            Connect your Stellar Testnet account to manage tasks and interact with the agent network.
          </p>

          <div className="form-group">
            <label htmlFor="secretKeyPage">Stellar Secret Key (Testnet)</label>
            <input
              type="text"
              id="secretKeyPage"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="S..."
              required
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <div className="error-msg" id="wallet-error-page" style={{ marginBottom: '15px' }}>
              {error}
            </div>
          )}

          <button type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </form>
      )}
    </div>
  );
};

export default WalletPage;
