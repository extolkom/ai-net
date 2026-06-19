import React, { useState } from 'react'
import { useWallet } from '../context/WalletContext'

const LandingPage: React.FC = () => {
  const { publicKey, connected, connect } = useWallet()
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await connect(secretKey)
      setSecretKey('')
    } catch (err: any) {
      // Provide a clearer error message for invalid secret keys
      const msg = err.message || ''
      if (/invalid/i.test(msg)) {
        setError('Invalid Stellar secret key')
      } else {
        setError('Failed to connect wallet')
      }
    }
  }

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '1.8rem', textAlign: 'center' }}>Connect Stellar Wallet</h1>
      
      {connected ? (
        <div style={{ textAlign: 'center' }} id="wallet-connected-section">
          <p style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '10px' }} id="connect-success">
            Wallet Connected Successfully!
          </p>
          <p style={{ wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
            <strong>Public Key:</strong> {publicKey}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} id="wallet-connect-form">
          <div className="form-group">
            <label htmlFor="secretKey">Stellar Secret Key (Testnet)</label>
            <input
              type="text"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="S..."
              required
              style={{ width: '100%' }}
            />
          </div>
          {error && (
            <div className="error-msg" id="wallet-error" style={{ marginBottom: '15px' }}>
              {error}
            </div>
          )}
          <button type="submit" style={{ width: '100%' }} id="btn-connect">
            Connect Wallet
          </button>
        </form>
      )}
    </div>
  )
}

export default LandingPage
