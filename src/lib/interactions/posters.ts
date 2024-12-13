import axios from "axios";

import { QuoteResponse, SwapTransactionResponse } from "@/types";

export async function postSwap(quoteResponse?: QuoteResponse): Promise<string> {
  const { data } = await axios.post<SwapTransactionResponse>("/api/swap", {
    quoteResponse,
  });

  return data.data?.txid ?? "";
}
