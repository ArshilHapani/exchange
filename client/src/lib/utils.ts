import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTokenSwap(
  amountX: number,
  priceX: number,
  priceY: number
): number {
  if (priceY === 0) {
    throw new Error("Price of token Y cannot be zero");
  }
  return (amountX * priceX) / priceY;
}
