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
};

export interface UserBalanceEndpointReturnType extends BaseResponse {
  data?: {
    totalBalance: number;
    balance: BalanceMetaData[];
  };
}
