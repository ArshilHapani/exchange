import { Connection } from "@solana/web3.js";

export const SUPPORTED_TOKENS = [
  {
    name: "USDC",
    mint: "FSxJ85FXVsXSr51SeWf9ciJWTcRnqKFSmBgRDeL3KyWw", // mainnet
    devNet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // devnet
  },
  {
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    devNet: "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS",
  },
];

export const mode: "devnet" | "mainnet" = "mainnet";

const devnetUrl = "https://api.devnet.solana.com";
const mainnetUrl = "https://api.mainnet-beta.solana.com";

export const connection = new Connection(
  (mode as string) === "devnet" ? devnetUrl : mainnetUrl
);
