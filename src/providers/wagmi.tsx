import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { metaMask} from 'wagmi/connectors'
import { createClient } from 'viem'
import { RPC_URL_BSC_TESTNET } from '@/config/constant'

export const config = createConfig({
  chains: [bscTestnet],
  ssr: true, 
  connectors: [
    metaMask(),
  ],
  client({ chain }) {
    return createClient({ chain, transport: http(RPC_URL_BSC_TESTNET) })
  },
})