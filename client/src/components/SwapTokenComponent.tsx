"use client";

import { useState, useEffect } from "react";
import { ArrowDownUp, ChevronDown, Settings2, Info } from "lucide-react";
import { TokenIcon } from "@web3icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TOKEN_TO_ICON_MAPPING } from "./TokenCard";
import { calculateTokenSwap } from "@/lib/utils";

type TokenData = {
  token: string;
  balanceInUSD: number;
  balance: number;
  price: number;
};

type Props = {
  data: TokenData[];
  userAddress: string;
};

export default function TokenSwap({ data }: Props) {
  const [payToken, setPayToken] = useState<TokenData>(data[0]);
  const [receiveToken, setReceiveToken] = useState<TokenData>(
    data[1] || data[0]
  );
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  useEffect(() => {
    setPayToken(data[0]);
    setReceiveToken(data[1] || data[0]);
  }, [data]);

  const handlePayTokenChange = (token: TokenData) => {
    setPayToken(token);
    if (token.token === receiveToken.token) {
      setReceiveToken(data.find((t) => t.token !== token.token) || token);
    }
  };

  const handleReceiveTokenChange = (token: TokenData) => {
    setReceiveToken(token);
    if (token.token === payToken.token) {
      setPayToken(data.find((t) => t.token !== token.token) || token);
    }
  };

  const handleSwapTokens = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setPayAmount(receiveAmount);
    setReceiveAmount(payAmount);
  };

  return (
    <div className="w-full rounded-xl bg-background shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Swap Tokens</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">You Pay:</label>
          <div className="flex gap-2">
            {/* select token to swap dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <TokenIcon
                    symbol={TOKEN_TO_ICON_MAPPING[payToken.token]}
                    className="h-5 w-5"
                  />
                  {payToken.token}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              {/* dropdown items */}
              <DropdownMenuContent align="start">
                {data.map((token) => (
                  <DropdownMenuItem
                    key={token.token}
                    onClick={() => handlePayTokenChange(token)}
                  >
                    <TokenIcon
                      symbol={TOKEN_TO_ICON_MAPPING[token.token]}
                      className="h-5 w-5 mr-2"
                    />
                    {token.token}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* input field for token to swap input */}
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="0"
                value={payAmount}
                onChange={(e) => {
                  setPayAmount(e.target.value);
                  const newReceiveAmount = calculateTokenSwap(
                    Number(e.target.value) ?? 0,
                    payToken.price,
                    receiveToken.price
                  );
                  setReceiveAmount(newReceiveAmount.toString());
                }}
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 text-xs"
                onClick={() => setPayAmount(payToken.balance.toString())}
              >
                Max
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground px-1">
            Current Balance: {payToken.balance} {payToken.token}
          </p>
        </div>

        {/* swap token (send -> receive vice versa) */}
        <div className="relative h-8">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleSwapTokens}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          <hr className="border-border" />
        </div>

        {/* receive token container */}
        <div className="space-y-2">
          <label className="text-sm font-medium">You Receive:</label>
          <div className="flex gap-2">
            {/* drop down for selecting receiving token */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <TokenIcon
                    symbol={TOKEN_TO_ICON_MAPPING[receiveToken.token]}
                    className="h-5 w-5"
                  />
                  {receiveToken.token}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {/* select receive token dropdown item */}
                {data.map((token) => (
                  <DropdownMenuItem
                    key={token.token}
                    onClick={() => handleReceiveTokenChange(token)}
                  >
                    <TokenIcon
                      symbol={TOKEN_TO_ICON_MAPPING[token.token]}
                      className="h-5 w-5 mr-2"
                    />
                    {token.token}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* readonly input for showing how many tokens are going to received */}
            <Input
              type="number"
              placeholder="0"
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
              className="flex-1"
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground px-1">
            Current Balance: {receiveToken.balance} {receiveToken.token}
          </p>
          {/* table of prices for send and receive token */}
          <Table>
            <TableCaption>Price chart.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{payToken.token} Price</TableHead>
                <TableHead>{receiveToken.token} Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">${payToken.price}</TableCell>
                <TableCell className="font-medium">
                  ${receiveToken.price}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* extras... */}
      <div className="flex items-center justify-between mt-4 mb-6">
        <Button variant="ghost" className="text-sm gap-2">
          <Info className="h-4 w-4" />
          View Swap Details
        </Button>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1" disabled={!payAmount || !receiveAmount}>
          Confirm & Swap
        </Button>
      </div>
    </div>
  );
}
