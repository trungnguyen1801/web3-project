import React from "react";
import Image from "next/image";
import { Address } from "viem";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { formatAddress } from "@/services/helper";

const Balance = ({
  logo,
  altLogo,
  token,
  address,
  balance,
}: {
  logo: StaticImport;
  altLogo: string;
  token: string;
  address: Address | undefined;
  balance: string | undefined;
}) => {
  return (
    <>
      <p className=" flex items-center gap-1 text-[#939393] text-[12px] mt-2">
        <Image
          src={logo}
          width={12}
          height={12}
          alt={altLogo}
        ></Image>
        {formatAddress(address as Address)}
      </p>
      <div className="flex flex-col border-[#323232] rounded-[12px] border-[1px] p-3">
        <span className="text-[12px] text-[#939393]">{token}</span>
        <p className="text-[16px]text-[#939393]">{balance || 0}</p>
      </div>
    </>
  );
};

export default Balance;
