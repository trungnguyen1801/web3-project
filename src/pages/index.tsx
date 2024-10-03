import React, { useMemo, useState } from "react";
import { useWallet } from "@/providers/wallet";
import Image from "next/image";
import WalletIcon from "@/public/images/wallet.svg";
import LogoMetamask from "@/public/images/metamask.svg";
import { formatAddress } from "@/services/helper";

const DecentralizedApp: React.FC = () => {
  const {
    connect,
    disconnect,
    transferBNB,
    transferUSDT,
    installMetaMask,
    address,
    installedMetaMask,
    loadingConnect,
    loadingTransferBNB,
    loadingTransferUSDT,
    connected,
    balanceBNB,
    balanceUSDT,
  } = useWallet();
  const [amountInBNB, setAmountInBNB] = useState("");
  const [recipientAddressBNB, setRecipientAddressBNB] = useState("");
  const [amountInUSDT, setAmountInUSDT] = useState("");
  const [recipientAddressUSDT, setRecipientAddressUSDT] = useState("");

  const buttonConnectContent = useMemo(() => {
    if (loadingConnect) return <span className="loader"></span>;
    if (!installedMetaMask) return "Install MetaMask";
    if (connected) {
      return "Disconnect MetaMask";
    } else {
      return "Connect MetaMask";
    }
  }, [loadingConnect, connected, installedMetaMask]);

  return (
    <>
      <div className="flex justify-end">
        <button
          className="w-[240px] m-5 flex items-center justify-center gap-2 text-black bg-white px-4 py-3 font-medium rounded-[36px] hover:bg-[#bfbfbf] transition-all"
          onClick={!installedMetaMask ? installMetaMask : connected ? disconnect : connect}
        >
          {buttonConnectContent}
          <Image src={WalletIcon} width={20} height={20} alt="wallet icon" />
        </button>
      </div>
      <div className="mx-auto bg-[#232323] max-w-[400px] text-white px-5 py-8 rounded-[12px]">
        <h2 className="text-[20px] font-medium">Balance</h2>
        <p className=" flex items-center gap-1 text-[#939393] text-[12px] mt-2">
          <Image
            src={LogoMetamask}
            width={12}
            height={12}
            alt="Logo Metamask"
          ></Image>
          {formatAddress(address)}
        </p>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3">
          <span className="text-[12px] text-[#939393]">BNB</span>
          <p className="text-[16px]text-[#939393]">{balanceBNB}</p>
        </div>
        <p className=" flex items-center gap-1 text-[#939393] text-[12px] mt-2">
          <Image
            src={LogoMetamask}
            width={12}
            height={12}
            alt="Logo Metamask"
          ></Image>
          {formatAddress(address)}
        </p>
        <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3">
          <span className="text-[12px] text-[#939393]">USDT</span>
          <p className="text-[16px]text-[#939393]">{balanceUSDT}</p>
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
          onClick={() => transferBNB(amountInBNB, recipientAddressBNB)}
          disabled={Number(amountInBNB) > Number(balanceBNB)}
        >
          {loadingTransferBNB ? (
            <span className="loader"></span>
          ) : (
            "Transfer BNB"
          )}
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
          onClick={() => transferUSDT(amountInUSDT, recipientAddressUSDT)}
          disabled={Number(amountInUSDT) > balanceUSDT}
        >
          {loadingTransferUSDT ? (
            <span className="loader"></span>
          ) : (
            "Transfer USDT"
          )}
        </button>
      </div>
    </>
  );
};

export default DecentralizedApp;
