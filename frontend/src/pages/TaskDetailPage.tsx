import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

interface NodeState {
  id: string
  label: string
  status: 'pending' | 'running' | 'completed' | 'failed'
}

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [nodes, setNodes] = useState<NodeState[]>([
    { id: 'node-research', label: 'Research Agent', status: 'running' },
    { id: 'node-coding', label: 'Code Generator', status: 'pending' },
    { id: 'node-report', label: 'Report Writer', status: 'pending' },
  ])
  const [wsStatus, setWsStatus] = useState('connecting')

  useEffect(() => {
    // Open WebSocket to local stream port 3001
    const ws = new WebSocket(`ws://localhost:3001/tasks/${id}/stream`)

    ws.onopen = () => {
      setWsStatus('connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'node_completed') {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === data.nodeId ? { ...node, status: 'completed' } : node
            )
          )
        } else if (data.type === 'node_started') {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === data.nodeId ? { ...node, status: 'running' } : node
            )
          )
        }
      } catch (err) {
        console.error('Failed to parse WS message', err)
      }
    }

    ws.onerror = () => {
      setWsStatus('error')
    }

    ws.onclose = () => {
      setWsStatus('disconnected')
    }

    return () => {
      ws.close()
    }
  }, [id])

  return (
    <div className="glass-panel">
      <div className="flex justify-between align-center" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Task Details</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '5px' }}>
            Task ID: {id}
          </p>
        </div>
        <span
          className="chip"
          style={{
            background:
              wsStatus === 'connected'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            borderColor:
              wsStatus === 'connected'
                ? 'rgba(16, 185, 129, 0.3)'
                : 'rgba(239, 68, 68, 0.3)',
            color: wsStatus === 'connected' ? '#a7f3d0' : '#fca5a5',
          }}
          id="ws-status"
        >
          WS: {wsStatus}
        </span>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>Execution DAG Preview</h3>
        
        <div className="dag-container" id="dag-preview" style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {index > 0 && <span className="dag-arrow" data-testid="dag-edge" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>➔</span>}
              <div
                className={`dag-node ${node.status}`}
                id={node.id}
                data-testid={`dag-node-${node.id}`}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid',
                  backgroundColor: node.status === 'completed' ? '#064e3b' : node.status === 'running' ? '#1e1b4b' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: node.status === 'completed' ? 'var(--success)' : node.status === 'running' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  boxShadow: node.status === 'completed' ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none',
                  minWidth: '150px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                <div>{node.label}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'normal', marginTop: '4px', opacity: 0.8 }} className="node-status">
                  {node.status}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskDetailPage
