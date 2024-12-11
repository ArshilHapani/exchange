/**
 * TimeStamp 4:23:18
 * follow orders
 */

import { Connection } from "@solana/web3.js";
import axios from "axios";

import { PriceApiResponse } from "@/types";

export const SUPPORTED_TOKENS = [
  {
    name: "solana",
    mint: "So11111111111111111111111111111111111111112",
    devNet: "So11111111111111111111111111111111111111112",
    native: true,
    price: 240,
    decimals: 9,
  },

  {
    name: "usd-coin",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    devNet: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    native: false,
    price: 1,
    decimals: 8,
  },
  {
    name: "tether",
    mint: "FSxJ85FXVsXSr51SeWf9ciJWTcRnqKFSmBgRDeL3KyWw", // mainnet
    devNet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // devnet
    native: false,
    price: 1,
    decimals: 8,
  },
];

export const mode: "devnet" | "mainnet" = "devnet";

const devnetUrl = "https://api.devnet.solana.com";
const mainnetUrl = "https://api.mainnet-beta.solana.com";

export const connection = new Connection(
  (mode as string) === "devnet" ? devnetUrl : mainnetUrl
);

////////////////////////////////////////////////////////////
/////////////////////// PRICING-APIS ///////////////////////
////////////////////////////////////////////////////////////

let LAST_UPDATED: number | null = null;
const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // 60sec
export let price: PriceApiResponse | null = null;

export async function getSupportedTokens() {
  if (
    !LAST_UPDATED ||
    new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL
  ) {
    const { data } = await axios.get<PriceApiResponse>(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana,tether,usd-coin&vs_currencies=usd"
    );
    price = data;
    LAST_UPDATED = new Date().getTime();
  }
  return SUPPORTED_TOKENS.map((token) => ({
    ...token,
    price: price![token.name as keyof PriceApiResponse].usd,
  }));
}
