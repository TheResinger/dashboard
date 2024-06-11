import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToUSDFormat(number: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    //@ts-expect-error: I dont relaly know why its throwing an error in the first place
  }).format(parseInt(number));
}
