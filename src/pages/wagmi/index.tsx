import React, { useState } from "react";
import {
  useConnect,
  useChainId,
  useAccount,
  useDisconnect,
  useBalance,
  useSendTransaction,
} from "wagmi";
import LogoMetamask from "@/public/images/metamask.svg";
import ConnectButton from "@/components/ConnectButton";
import type { Address } from "viem";
import { parseEther } from "viem";
import { ADDRESS_USDT_TOKEN } from "@/config/constant";
import { toast } from "react-toastify";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";

const DecentralizedApp = () => {
  const chainId = useChainId();
  const { isConnected, address, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceBNB } = useBalance({ address });
  const { data: balanceUSDT } = useBalance({
    address,
    token: ADDRESS_USDT_TOKEN,
  });
  const {
    sendTransaction: transferBNB,
    isPending: isPendingBNB,
  } = useSendTransaction({
    mutation: {
      onSuccess() {
        toast.success("Success!");
        setRecipientAddressBNB("");
        setAmountInBNB("");
      },
      onError(error) {
        console.error(error);
        toast.error("Error!");
      },
    },
  });
  const {
    sendTransaction: transferUSDT,
    isPending: isPendingUSDT,
  } = useSendTransaction({
    mutation: {
      onSuccess() {
        toast.success("Success!");
        setRecipientAddressUSDT("");
        setAmountInUSDT("");
      },
      onError(error) {
        console.error(error);
        toast.error("Error!");
      },
    },
  });

  const [amountInBNB, setAmountInBNB] = useState<string>("");
  const [recipientAddressBNB, setRecipientAddressBNB] = useState<string>("");
  const [amountInUSDT, setAmountInUSDT] = useState<string>("");
  const [recipientAddressUSDT, setRecipientAddressUSDT] = useState<string>("");

  return (
    <>
      {connectors.map(
        (connector) =>
          connector.type === "metaMask" && (
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
          address={address}
          balance={balanceBNB?.formatted}
        />
        <Balance
          logo={LogoMetamask}
          altLogo={"Logo MetaMask"}
          token="USDT"
          address={address}
          balance={balanceUSDT?.formatted}
        />
        <Transfer
          token="BNB"
          toAddress={recipientAddressBNB}
          amount={amountInBNB}
          onInputAddress={(address) => setRecipientAddressBNB(address)}
          onInputAmount={(amount) => setAmountInBNB(amount)}
          transfer={() =>
            transferBNB({
              to: recipientAddressBNB as Address,
              value: parseEther(amountInBNB),
            })
          }
          disabledTransfer={
            Number(amountInBNB) > Number(balanceBNB) ||
            !recipientAddressBNB ||
            !amountInBNB
          }
          loading={isPendingBNB}
        />
        <Transfer
          token="USDT"
          toAddress={recipientAddressUSDT}
          amount={amountInUSDT}
          onInputAddress={(address) => setRecipientAddressUSDT(address)}
          onInputAmount={(amount) => setAmountInUSDT(amount)}
          transfer={() =>
            transferUSDT({
              to: recipientAddressUSDT as Address,
              value: parseEther(amountInUSDT),
            })
          }
          disabledTransfer={
            Number(amountInUSDT) > Number(balanceUSDT) ||
            !recipientAddressUSDT ||
            !amountInUSDT
          }
          loading={isPendingUSDT}
        />
      </div>
    </>
  );
};

export default DecentralizedApp;
