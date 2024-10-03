import React from 'react'
import type { AppProps } from 'next/app'
import WalletProvider from '@/providers/wallet'
import "@/pages/index.css"
import { Eip1193Provider } from 'ethers'

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string, params?: Array<any> }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </div>
  )
}

export default App