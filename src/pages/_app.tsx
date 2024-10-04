import React from "react";
import type { AppProps } from "next/app";
import WalletProvider from "@/providers/wallet";
import "@/pages/index.css";
import { WagmiProvider } from "wagmi";
import { config } from "@/providers/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
declare global {
  interface Window {
    ethereum?: any;
  }
}

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <Component {...pageProps} />
            <ToastContainer />
          </WalletProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};

export default App;
