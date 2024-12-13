export type PriceApiResponse = {
  solana: {
    usd: number;
  };
  tether: {
    usd: number;
  };
  "usd-coin": {
    usd: number;
  };
};

export interface BaseResponse {
  success: boolean;
  message: string;
}

export type BalanceMetaData = {
  token: string;
  balanceInUSD: number;
  balance: number;
  price: number;
  address: string;
  decimals: number;
};

export interface UserBalanceEndpointReturnType extends BaseResponse {
  data?: {
    totalBalance: number;
    balance: BalanceMetaData[];
  };
}

export interface SwapTransactionResponse extends BaseResponse {
  data?: {
    txid: string;
  };
}

//////////////////////////////////////////////////
/////////////////// QUOTE API ///////////////////
//////////////////////////////////////////////////

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn";
  slippageBps: number;
  platformFee: null;
  priceImpactPct: string;
  routePlan: RoutePlanItem[];
  scoreReport: null;
  contextSlot: number;
  timeTaken: number;
}

interface RoutePlanItem {
  swapInfo: SwapInfo;
  percent: number;
}

interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}
