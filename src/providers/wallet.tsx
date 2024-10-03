import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import {
  ADDRESS_USDT_TOKEN,
  BSC_CHAIN_ID_TESTNET,
  RPC_URL_BSC_TESTNET,
  ERC20_ABI,
} from "@/config/constant";

const WalletContext = createContext<{
  connect: () => void;
  disconnect: () => void;
  transferBNB: (amountBNB: string, recipientAddress: string) => void;
  transferUSDT: (amountUSDT: string, recipientAddress: string) => void;
  installMetaMask: () => void;
  address: string;
  installedMetaMask: boolean;
  loadingConnect: boolean;
  loadingTransferBNB: boolean;
  loadingTransferUSDT: boolean;
  connected: boolean;
  balanceBNB: number;
  balanceUSDT: number;
}>({
  connect: () => {},
  disconnect: () => {},
  transferBNB: () => {},
  transferUSDT: () => {},
  installMetaMask: () => {},
  address: "",
  installedMetaMask: false,
  loadingConnect: false,
  loadingTransferBNB: false,
  loadingTransferUSDT: false,
  connected: false,
  balanceBNB: 0,
  balanceUSDT: 0,
});

export const useWallet = () => {
  const {
    connect,
    address,
    connected,
    installedMetaMask,
    loadingConnect,
    loadingTransferBNB,
    loadingTransferUSDT,
    balanceBNB,
    balanceUSDT,
    transferBNB,
    transferUSDT,
    disconnect,
    installMetaMask,
  } = useContext(WalletContext);
  return {
    connect,
    address,
    installedMetaMask,
    connected,
    loadingConnect,
    loadingTransferBNB,
    loadingTransferUSDT,
    balanceBNB,
    balanceUSDT,
    transferBNB,
    transferUSDT,
    disconnect,
    installMetaMask,
  };
};

const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [provider, setProvider] = useState<any>(null);
  const [installedMetaMask, setInstalledMetaMask] = useState<boolean>(false);
  const [loadingConnect, setLoadingConnect] = useState<boolean>(false);
  const [loadingTransferBNB, setLoadingTransferBNB] = useState<boolean>(false);
  const [loadingTransferUSDT, setLoadingTransferUSDT] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [balanceBNB, setBalanceBNB] = useState<number>(0);
  const [balanceUSDT, setBalanceUSDT] = useState<number>(0);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!window.ethereum) {
      setInstalledMetaMask(false);
      return;
    };
    setProvider(new ethers.BrowserProvider(window.ethereum));
    setInstalledMetaMask(true);
  }, []);

  useEffect(() => {
    if(!provider) return;
    checkConnected();
  }, [provider])

  const installMetaMask = () => {
    window.open("https://metamask.io/", "_blank");
  }

  const checkConnected = async () => {
    if(!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if(accounts.length > 0) {
        setConnected(true);
        connect();
      } else {
        setConnected(false);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getBalanceBNB = async (address: string) => {
    try {
      const balanceInWei = await provider.send("eth_getBalance", [
        address,
        "latest",
      ]);
      const balanceInBNB = ethers.formatUnits(balanceInWei);
      setBalanceBNB(Number(balanceInBNB));
    } catch (getBalanceError) {
      console.error(getBalanceError);
    }
  };

  const switchNetworkBSC = async () => {
    if (!window.ethereum) return;

    const chainIdCurrent = await provider.send("eth_chainId", []);
    if (chainIdCurrent === BSC_CHAIN_ID_TESTNET) return;

    try {
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: BSC_CHAIN_ID_TESTNET,
          chainName: "Binance Smart Chain Testnet",
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: [RPC_URL_BSC_TESTNET],
        },
      ]);
    } catch (switchError) {
      console.error(switchError);
    }
  };

  const getBalanceUSDT = async (address: string) => {
    try {
      const tokenContract = new ethers.Contract(
        ADDRESS_USDT_TOKEN,
        ERC20_ABI,
        provider
      );
      const balanceUSDT = await tokenContract.balanceOf(address);
      const decimals = await tokenContract.decimals();
      const formattedBalance = ethers.formatUnits(balanceUSDT, decimals);
      setBalanceUSDT(Number(formattedBalance));
    } catch (getBalanceTokenError) {
      console.error(getBalanceTokenError);
    }
  };

  const getWalletAddress = async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setConnected(true);
      return accounts[0];
    } catch (getAddressError) {
      setConnected(false);
      console.error(getAddressError);
    }
  };

  const connect = async () => {
    try {
      setLoadingConnect(true);
      const address = await getWalletAddress();
      if(!address) return;
      setAddress(address);
      switchNetworkBSC();
      getBalanceBNB(address);
      getBalanceUSDT(address);
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingConnect(false);
    }
  };

  const disconnect = () => {
    setAddress("");
    setConnected(false);
    setBalanceBNB(0);
    setBalanceUSDT(0)
  };

  const transferBNB = async (amountBNB: string, recipientAddress: string) => {
    if(Number(amountBNB) > balanceBNB) return;
    try {
      setLoadingTransferBNB(true);
      const signer = await provider.getSigner();
      const amountInWei = ethers.parseEther(amountBNB);
      const transactionResponse = await signer.sendTransaction({
        to: recipientAddress,
        value: amountInWei,
      });
      await transactionResponse.wait();
      setLoadingTransferBNB(false);
      alert("Transfer BNB success!")
    } catch (transferBNBError) {
      console.error(transferBNBError);
    } finally {
      setLoadingTransferBNB(false);
    }
  };

  const transferUSDT = async (amountUSDT: string, recipientAddress: string) => {
    if(Number(amountUSDT) > balanceUSDT) return;
    try {
      setLoadingTransferUSDT(true);
      const signer = await provider.getSigner();
      const amountInWei = ethers.parseUnits(amountUSDT);
      const tokenContract = new ethers.Contract(
        ADDRESS_USDT_TOKEN,
        ERC20_ABI,
        signer
      );
      const transactionResponse = await tokenContract.transfer(
        recipientAddress,
        amountInWei
      );
      await transactionResponse.wait();
      setLoadingTransferUSDT(false);
      alert("Transfer USDT success!");
    } catch (transferUSDTError) {
      console.error(transferUSDTError);
    } finally {
      setLoadingTransferUSDT(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        installedMetaMask,
        connect,
        transferBNB,
        transferUSDT,
        disconnect,
        installMetaMask,
        connected,
        loadingConnect,
        loadingTransferBNB,
        loadingTransferUSDT,
        balanceBNB,
        balanceUSDT,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
