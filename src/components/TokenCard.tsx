"use client";

import { TokenIcon } from "@web3icons/react";

import ShowQRModal from "./dialogs/ShowAddressQR";
import useModal from "@/hooks/useDialog";

type Props = {
  data: {
    token: string;
    balanceInUSD: number;
    balance: number;
  };
  userAddress: string;
};

export const TOKEN_TO_ICON_MAPPING: { [key: string]: string } = {
  tether: "usdt",
  solana: "sol",
  "usd-coin": "usdc",
};

const TokenCard = ({
  data: { balance, balanceInUSD, token },
  userAddress,
}: Props) => {
  const { openModal } = useModal();
  return (
    <>
      <div
        className="group my-2 rounded-lg p-4 bg-muted hover:bg-muted/80 transition-colors cursor-pointer select-none"
        onClick={() => openModal(`show-qr-${userAddress + token}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TokenIcon
              symbol={TOKEN_TO_ICON_MAPPING[token]}
              variant="mono"
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="font-medium capitalize text-foreground">
                {token.replace("-", " ")}
              </span>
              <span className="text-sm text-muted-foreground">
                {balance > 0
                  ? `${balance.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })} ${TOKEN_TO_ICON_MAPPING[token].toUpperCase()}`
                  : "No balance"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-foreground">
              {balanceInUSD > 0
                ? `$${balanceInUSD.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "$0"}
            </div>
            <div className="text-sm text-muted-foreground">
              {balance > 0 && balanceInUSD > 0
                ? `$${(balanceInUSD / balance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} per token`
                : "Price unavailable"}
            </div>
          </div>
        </div>
      </div>

      {/* dialogs */}
      <ShowQRModal token={token} address={userAddress} />
    </>
  );
};

export default TokenCard;
