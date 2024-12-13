"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import { TokenIcon } from "@web3icons/react";
import { toast } from "sonner";

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
import { Skeleton } from "./ui/skeleton";

import { TOKEN_TO_ICON_MAPPING } from "./TokenCard";
import { getQuote } from "@/lib/interactions/getters";

import { QuoteResponse, BalanceMetaData as TokenData } from "@/types";
import { postSwap } from "@/lib/interactions/posters";

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
  const [quoteResponse, setQuoteResponse] = useState<
    QuoteResponse | undefined
  >();

  const { isPending, mutate } = useMutation({
    mutationFn: getQuote,
  });
  const postSwapFn = useMutation({
    mutationFn: postSwap,
  });

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

  async function handleSwap() {
    postSwapFn.mutate(quoteResponse, {
      onSuccess(data) {
        if (data !== "") {
          toast.success(`Swap successful with txid: ${data}`, {
            duration: 10000,
          });
        } else {
          toast.error("Swap failed, please try again later");
        }
      },
      onError() {
        toast.error("Swap failed, please try again later");
      },
    });
  }

  function setQuoteTokens(amount: number, isReceived: boolean) {
    const sendToken = isReceived ? receiveToken : payToken;
    const receiveTokenL = isReceived ? payToken : receiveToken;
    setTimeout(() => {
      mutate(
        {
          payToken: sendToken.address,
          receiveToken: receiveTokenL.address,
          amount: amount * Math.pow(10, sendToken.decimals),
        },
        {
          onSuccess(data) {
            setQuoteResponse(data);
            if (isReceived) {
              setPayAmount(
                (
                  Number(data.outAmount ?? "0") /
                  Math.pow(10, receiveTokenL.decimals)
                ).toString()
              );
            } else {
              setReceiveAmount(
                (
                  Number(data.outAmount ?? "0") /
                  Math.pow(10, receiveTokenL.decimals)
                ).toString()
              );
            }
          },
        }
      );
    }, 400);
  }
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
              {isPending ? (
                <>
                  <Skeleton className="w-full h-10 rounded-lg" />
                </>
              ) : (
                <>
                  <Input
                    type="number"
                    placeholder="0"
                    value={payAmount}
                    onChange={(e) => {
                      setPayAmount(e.target.value);
                      setQuoteTokens(Number(e.target.value), false);
                    }}
                    // dir="rtl"
                    className="pr-16 outline-none focus:outline-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 text-xs"
                    onClick={() => {
                      setPayAmount(payToken.balance.toString());
                      setQuoteTokens(payToken.balance, false);
                    }}
                  >
                    Max
                  </Button>
                </>
              )}
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
            {isPending ? (
              <>
                <Skeleton className="w-full h-10 rounded-lg" />
              </>
            ) : (
              <>
                <Input
                  type="number"
                  placeholder="0"
                  value={receiveAmount}
                  onChange={(e) => {
                    setReceiveAmount(e.target.value);
                    setQuoteTokens(Number(e.target.value), true);
                  }}
                  // dir="rtl"
                  className="outline-none focus:outline-none flex-1"
                />
              </>
            )}
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

      <div className="flex gap-3 mt-4">
        <Button
          disabled={
            !payAmount || !receiveAmount || postSwapFn.isPending || isPending
          }
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          disabled={
            !payAmount || !receiveAmount || postSwapFn.isPending || isPending
          }
          onClick={handleSwap}
        >
          Confirm & Swap
        </Button>
      </div>
    </div>
  );
}
