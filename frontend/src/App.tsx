import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { WalletProvider, useWallet } from './context/WalletContext'
import LandingPage from './pages/LandingPage'
import AgentsPage from './pages/AgentsPage'
import NewTaskPage from './pages/tasks/NewTaskPage'
import TaskDetailPage from './pages/TaskDetailPage'
import DashboardPage from './pages/dashboard'
import WalletPage from './pages/WalletPage'
import ErrorBoundary from './components/common/ErrorBoundary'

const TopNav: React.FC = () => {
  const { publicKey, connected, disconnect } = useWallet()
  const location = useLocation()

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Home'
      case '/dashboard': return 'Dashboard'
      case '/wallet': return 'Wallet'
      case '/agents': return 'Agent Registry'
      case '/tasks/new': return 'New Task'
      default:
        if (location.pathname.startsWith('/tasks/')) return 'Task Monitoring'
        return 'Dashboard'
    }
  }

  const truncateKey = (key: string) => {
    if (key.length <= 8) return key
    return `${key.slice(0, 4)}...${key.slice(-3)}`
  }

  return (
    <header>
      <Link to="/" className="logo">ai-net</Link>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)' }} id="page-title">{getTitle()}</h2>
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''} id="nav-home">Home</Link>
        {connected && (
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''} id="nav-dashboard">Dashboard</Link>
        )}
        <Link to="/agents" className={location.pathname === '/agents' ? 'active' : ''} id="nav-agents">Agents</Link>
        <Link to="/tasks/new" className={location.pathname === '/tasks/new' ? 'active' : ''} id="nav-new-task">New Task</Link>
        {connected && (
          <Link to="/wallet" className={location.pathname === '/wallet' ? 'active' : ''} id="nav-wallet">Wallet</Link>
        )}
        
        {connected && publicKey ? (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className="chip" id="wallet-pubkey-display">{truncateKey(publicKey)}</span>
            <button onClick={disconnect} style={{ background: 'var(--danger)' }} id="btn-disconnect">Disconnect</button>
          </div>
        ) : (
          <span className="chip" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }} id="wallet-pubkey-display">Not Connected</span>
        )}
      </nav>
    </header>
  )
}

const AppContent: React.FC = () => {
  return (
    <Router>
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/tasks/new" element={<NewTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Routes>
      </main>
    </Router>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </ErrorBoundary>
  )
}

export default App
