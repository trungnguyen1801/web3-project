"use client";
import React, { useEffect, useState } from "react";
import { useAccount, Connector } from "wagmi";
import Image from "next/image";
import WalletIcon from "@/public/images/wallet.svg";

const ConnectButton = ({
  connector,
  onClick,
  loading,
}: {
  connector: Connector;
  onClick: () => void;
  loading: boolean;
}) => {
  const [ready, setReady] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <button
      key={connector.uid}
      className="w-[240px] m-5 flex items-center justify-center gap-2 text-black bg-white px-4 py-3 font-medium rounded-[36px] hover:bg-[#bfbfbf] transition-all"
      onClick={onClick}
      disabled={!ready}
    >
      {loading ? (
        <span className="loader"></span>
      ) : isConnected ? (
        `Disconnect ${connector.name}`
      ) : (
        `Connect ${connector.name}`
      )}
      <Image src={WalletIcon} width={20} height={20} alt="wallet icon" />
    </button>
  );
};

export default ConnectButton;
