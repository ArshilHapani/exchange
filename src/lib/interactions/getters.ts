import type { QuoteResponse, UserBalanceEndpointReturnType } from "@/types";
import axios from "axios";

export async function getAvailableTokenBalanceAndTotalBalance(address: string) {
  const { data } = await axios.get<UserBalanceEndpointReturnType>(
    `/api/tokens?address=${address}`
  );
  return data;
}

export async function getQuote({
  payToken,
  receiveToken,
  amount,
}: {
  payToken: string;
  receiveToken: string;
  amount: number;
}) {
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=${payToken}&outputMint=${receiveToken}&amount=${amount}&slippageBps=50`;
  const { data } = await axios.get<QuoteResponse>(url);
  return data;
}
