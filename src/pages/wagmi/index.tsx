import React, { useEffect, useState } from "react";
import {
  useConnect,
  useChainId,
  useAccount,
  useDisconnect,
  useBalance,
  useSendTransaction,
} from "wagmi";
import Image from "next/image";
import LogoMetamask from "@/public/images/metamask.svg";
import ConnectButton from "@/components/ConnectButton";
import { formatAddress } from "@/services/helper";
import type { Address } from "viem";
import { parseEther } from "viem";
import { ADDRESS_USDT_TOKEN } from "@/config/constant";
import { toast } from "react-toastify";

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
        <p className=" flex items-center gap-1 text-[#939393] text-[12px] mt-2">
          <Image
            src={LogoMetamask}
            width={12}
            height={12}
            alt="Logo Metamask"
          ></Image>
          {formatAddress(address as Address)}
        </p>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3">
          <span className="text-[12px] text-[#939393]">BNB </span>
          <p className="text-[16px]text-[#939393]">{balanceBNB?.formatted}</p>
        </div>
        <p className=" flex items-center gap-1 text-[#939393] text-[12px] mt-2">
          <Image
            src={LogoMetamask}
            width={12}
            height={12}
            alt="Logo Metamask"
          ></Image>
          {formatAddress(address as Address)}
        </p>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3">
          <span className="text-[12px] text-[#939393]">USDT</span>
          <p className="text-[16px]text-[#939393]">{balanceUSDT?.formatted}</p>
        </div>
        <h2 className="text-[20px] font-medium mt-3">Transfer BNB</h2>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3 mt-3">
          <label
            className="text-[12px] text-[#939393]"
            htmlFor="recipient-address-bnb"
          >
            Recipient Address BNB
          </label>
          <input
            className="bg-transparent outline-none border-none placeholder:text-[16px] placeholder:text-[#939393]"
            placeholder="0x00.."
            id="recipient-address-bnb"
            value={recipientAddressBNB}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRecipientAddressBNB(e.target.value)
            }
          ></input>
        </div>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3 mt-3">
          <label className="text-[12px] text-[#939393]" htmlFor="amount-bnb">
            Amount BNB
          </label>
          <input
            className="bg-transparent outline-none border-none placeholder:text-[16px] placeholder:text-[#939393]"
            placeholder="0"
            id="amount-bnb"
            type="number"
            value={amountInBNB}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmountInBNB(e.target.value)
            }
          ></input>
        </div>
        <button
          className="bg-white w-full p-4 rounded-[12px] text-black text-[16px] mt-3 hover:bg-[#999999] disabled:bg-[#999999] transition-all"
          onClick={() =>
            transferBNB({
              to: recipientAddressBNB as Address,
              value: parseEther(amountInBNB),
            })
          }
          disabled={
            Number(amountInBNB) > Number(balanceBNB) ||
            !recipientAddressBNB ||
            !amountInBNB
          }
        >
          {isPendingBNB ? <span className="loader"></span> : "Transfer BNB"}
        </button>
        <h2 className="text-[20px] font-medium mt-3">Transfer USDT</h2>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3 mt-3">
          <label
            className="text-[12px] text-[#939393]"
            htmlFor="recipient-address-usdt"
          >
            Recipient Address USDT
          </label>
          <input
            className="bg-transparent outline-none border-none placeholder:text-[16px] placeholder:text-[#939393]"
            id="recipient-address-usdt"
            placeholder="0x00.."
            value={recipientAddressUSDT}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRecipientAddressUSDT(e.target.value)
            }
          ></input>
        </div>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3 mt-3">
          <label className="text-[12px] text-[#939393]" htmlFor="amount-usdt">
            Amount USDT
          </label>
          <input
            id="amount-usdt"
            className="bg-transparent outline-none border-none placeholder:text-[16px] placeholder:text-[#939393]"
            type="number"
            placeholder="0"
            value={amountInUSDT}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmountInUSDT(e.target.value)
            }
          ></input>
        </div>
        <button
          className="bg-white w-full p-4 rounded-[12px] text-black text-[16px] mt-3 hover:bg-[#999999] disabled:bg-[#999999] transition-all"
          onClick={() =>
            transferUSDT({
              to: recipientAddressUSDT as Address,
              value: parseEther(amountInUSDT),
            })
          }
          disabled={
            Number(amountInUSDT) > Number(balanceUSDT) ||
            !recipientAddressUSDT ||
            !amountInUSDT
          }
        >
          {isPendingUSDT ? <span className="loader"></span> : "Transfer USDT"}
        </button>
      </div>
    </>
  );
};

export default DecentralizedApp;
