import type { UserBalanceEndpointReturnType } from "@/types";
import axios from "axios";

export async function getAvailableTokenBalanceAndTotalBalance(address: string) {
  const { data } = await axios.get<UserBalanceEndpointReturnType>(
    `/api/tokens?address=${address}`
  );
  return data;
}
