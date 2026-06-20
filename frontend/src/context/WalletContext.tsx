import React, { createContext, useContext, useState } from 'react'
import { Keypair } from '@stellar/stellar-sdk'

export class InvalidKeypairError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidKeypairError'
  }
}

interface WalletContextType {
  publicKey: string | null
  connected: boolean
  connect: (secretKey: string) => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(() => {
    return localStorage.getItem('wallet_pubkey')
  })

  const connected = !!publicKey

  const connect = async (secretKey: string) => {
    try {
      // Validates Stellar secret key (must be valid format starting with S)
      const keypair = Keypair.fromSecret(secretKey)
      const pubKey = keypair.publicKey()
      setPublicKey(pubKey)
      localStorage.setItem('wallet_pubkey', pubKey)
    } catch (e) {
      throw new InvalidKeypairError('Invalid Stellar secret key. Must start with S and be 56 characters.')
    }
  }

  const disconnect = () => {
    setPublicKey(null)
    localStorage.removeItem('wallet_pubkey')
  }

  return (
    <WalletContext.Provider value={{ publicKey, connected, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
