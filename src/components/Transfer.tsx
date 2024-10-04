import React from "react";
import { Address } from "viem";

const Transfer = ({
  token,
  toAddress,
  amount,
  onInputAddress,
  onInputAmount,
  transfer,
  disabledTransfer,
  loading,
}: {
  token: string;
  toAddress: string;
  amount: string;
  onInputAddress: (address: string) => void;
  onInputAmount: (amount: string) => void;
  transfer: () => void;
  disabledTransfer: boolean;
  loading: boolean;
}) => {
  return (
    <>
      <h2 className="text-[20px] font-medium mt-3">Transfer {token}</h2>
      <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3 mt-3">
        <label
          className="text-[12px] text-[#939393]"
          htmlFor={`recipient-address-${token}`}
        >
          Recipient Address {token}
        </label>
        <input
          className="bg-transparent outline-none border-none placeholder:text-[16px] placeholder:text-[#939393]"
          placeholder="0x00.."
          id={`recipient-address-${token}`}
          value={toAddress}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputAddress(e.target.value)
          }
        ></input>
      </div>
      <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3 mt-3">
        <label className="text-[12px] text-[#939393]" htmlFor={`amount-${token}`}>
          Amount {token}
        </label>
        <input
          className="bg-transparent outline-none border-none placeholder:text-[16px] placeholder:text-[#939393]"
          placeholder="0"
          id={`amount-${token}`}
          type="number"
          value={amount}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputAmount(e.target.value)
          }
        ></input>
      </div>
      <button
        className="bg-white w-full p-4 rounded-[12px] text-black text-[16px] mt-3 hover:bg-[#999999] disabled:bg-[#999999] transition-all"
        onClick={transfer}
        disabled={disabledTransfer}
      >
        {loading ? <span className="loader"></span> : `Transfer ${token}`}{" "}
      </button>
    </>
  );
};

export default Transfer;
