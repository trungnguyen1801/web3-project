import React from 'react'
import type { AppProps } from 'next/app'
import WalletProvider from '@/providers/wallet'
import "@/pages/index.css"

declare global {
  interface Window {
    ethereum?: any;
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