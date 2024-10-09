import React, { useEffect, useState } from "react";
import {
  useConnect,
  useChainId,
  useAccount,
  useDisconnect,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import LogoMetamask from "@/public/images/metamask.svg";
import ConnectButton from "@/components/ConnectButton";
import type { Address } from "viem";
import { formatEther, formatUnits, parseEther } from "viem";
import {
  ADDRESS_USDT_TOKEN,
  BSC_CHAIN_ID,
  GWEI_DECIMAL,
  BSC_DECIMAL,
} from "@/config/constant";
import { erc20Abi } from "viem";
import { toast } from "react-toastify";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";
import { estimateFeesPerGas, getBlock, prepareTransactionRequest } from "wagmi/actions";
import { config } from "@/providers/wagmi";
import Decimal from "decimal.js";
import { type } from "os";
import { parseGwei } from "viem";
import { ethers } from "ethers"

type Balance = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
};

const DecentralizedApp = () => {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const {
    isConnected,
    address: account,
    isConnecting,
    chainId: chainIdAccount,
  } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceBNB } = useBalance({ address: account });
  const { data: balanceUSDT } = useBalance({
    address: account,
    token: ADDRESS_USDT_TOKEN,
  });
  const {
    data: hashBNB,
    sendTransaction: transferBNB,
    error,
  } = useSendTransaction();
  const {
    isLoading: isPendingBNB,
    isSuccess: isSuccessBNB,
  } = useWaitForTransactionReceipt({
    hash: hashBNB,
  });
  const { data: hashUSDT, writeContract } = useWriteContract();
  const {
    isLoading: isPendingUSDT,
    isSuccess: isSuccessUSDT,
  } = useWaitForTransactionReceipt({
    hash: hashUSDT,
  });

  const [amountInBNB, setAmountInBNB] = useState<string>("");
  const [recipientAddressBNB, setRecipientAddressBNB] = useState<string>("");
  const [amountInUSDT, setAmountInUSDT] = useState<string>("");
  const [recipientAddressUSDT, setRecipientAddressUSDT] = useState<string>("");

  useEffect(() => {
    if (chainIdAccount !== BSC_CHAIN_ID) disconnect();
  }, [chainIdAccount]);

  useEffect(() => {
    if (isSuccessBNB) {
      toast.success("Success!");
      setRecipientAddressBNB("");
      setAmountInBNB("");
    } else if (isSuccessUSDT) {
      toast.success("Success!");
      setRecipientAddressUSDT("");
      setAmountInUSDT("");
    } else if (error) {
      toast.error(error as any);
    }
  }, [isSuccessBNB, isSuccessUSDT]);

  const handleTransferBNB = async () => {
    if (!publicClient) return;
    try {
      const gasEstimate = await publicClient.estimateGas({
        account: account as Address,
        to: recipientAddressBNB as Address,
        value: parseEther(amountInBNB),
      });
      const gasPrice = await publicClient.getGasPrice();
      if (!gasEstimate || !balanceBNB) return;
      const _gasEstimate = new Decimal(formatUnits(gasEstimate, GWEI_DECIMAL));
      const _gasPrice = new Decimal(formatUnits(gasPrice, GWEI_DECIMAL));
      const _amountInBNB = new Decimal(
        formatUnits(parseEther(amountInBNB), BSC_DECIMAL)
      );
      const _balance = new Decimal(formatUnits(balanceBNB.value, BSC_DECIMAL));
      if (_amountInBNB.add(_gasEstimate.mul(_gasPrice)).greaterThan(_balance)) {
        toast.error("Not enough gas");
        return;
      }
    } catch (error) {
      toast.error("Not enough balance");
      return;
    }

    try {
      await transferBNB({
        to: recipientAddressBNB as Address,
        value: parseEther(amountInBNB),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const transferUSDT = async () => {
    if (!publicClient) return;
    try {
      const gasEstimate = await publicClient.estimateContractGas({
        address: ADDRESS_USDT_TOKEN,
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipientAddressUSDT as Address, parseEther(amountInUSDT)],
        account: account,
      });
      const gasPrice = await publicClient.getGasPrice();
      if (!gasEstimate || !balanceUSDT || !balanceBNB) return;
      const _gasEstimate = new Decimal(formatUnits(gasEstimate, GWEI_DECIMAL));
      const _gasPrice = new Decimal(formatUnits(gasPrice, GWEI_DECIMAL));
      const _amountInUSDT = new Decimal(
        formatUnits(parseEther(amountInUSDT), BSC_DECIMAL)
      );
      const _balanceUSDT = new Decimal(
        formatUnits(balanceUSDT.value, BSC_DECIMAL)
      );
      const _balanceBNB = new Decimal(
        formatUnits(balanceBNB.value, BSC_DECIMAL)
      );
      if (
        _gasEstimate.mul(_gasPrice).greaterThan(_balanceBNB)
      ) {
        toast.error("Not enough gas");
        return;
      } else if (
        _amountInUSDT.greaterThan(_balanceUSDT)
      ) {
        toast.error("Not enough balance");
        return;
      }
    } catch (error) {
      toast.error("Not enough balance");
      return;
    }

    await writeContract({
      abi: erc20Abi,
      address: ADDRESS_USDT_TOKEN,
      functionName: "transfer",
      args: [recipientAddressUSDT as Address, parseEther(amountInUSDT)],
    });
  };

  return (
    <>
      {connectors.map(
        (connector) =>
          connector.id === "io.metamask" && (
            <ConnectButton
              key={connector.uid}
              connector={connector}
              loading={isConnecting}
              onClick={() =>
                isConnected
                  ? disconnect({ connector })
                  : connect({ connector, chainId })
              }
            />
          )
      )}
      <div className="mx-auto bg-[#232323] max-w-[400px] text-white px-5 py-8 rounded-[12px]">
        <h2 className="text-[20px] font-medium">Balance</h2>
        <Balance
          logo={LogoMetamask}
          altLogo={"Logo MetaMask"}
          token="BNB"
          address={account}
          balance={balanceBNB?.formatted}
        />
        <Balance
          logo={LogoMetamask}
          altLogo={"Logo MetaMask"}
          token="USDT"
          address={account}
          balance={balanceUSDT?.formatted}
        />
        <Transfer
          token="BNB"
          toAddress={recipientAddressBNB}
          amount={amountInBNB}
          onInputAddress={(address) => setRecipientAddressBNB(address)}
          onInputAmount={(amount) => setAmountInBNB(amount)}
          transfer={handleTransferBNB}
          disabledTransfer={!recipientAddressBNB || !amountInBNB}
          loading={isPendingBNB}
        />
        <Transfer
          token="USDT"
          toAddress={recipientAddressUSDT}
          amount={amountInUSDT}
          onInputAddress={(address) => setRecipientAddressUSDT(address)}
          onInputAmount={(amount) => setAmountInUSDT(amount)}
          transfer={transferUSDT}
          disabledTransfer={!recipientAddressUSDT || !amountInUSDT}
          loading={isPendingUSDT}
        />
      </div>
    </>
  );
};

export default DecentralizedApp;
