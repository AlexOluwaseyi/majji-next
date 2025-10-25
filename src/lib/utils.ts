import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateUsername(email: string) {
  const emailPrefix = email.split('@')[0];
  // const hasNumerals = /\d/.test(emailPrefix);

  const truncatedPrefix = emailPrefix.length > 8
    ? emailPrefix.substring(0, 8)
    : emailPrefix;

  const hasNumerals = /\d/.test(truncatedPrefix);

  const randomNum = Math.floor(Math.random() * 100); // ✅ 0–99

  const username = hasNumerals
    ? truncatedPrefix
    : `${truncatedPrefix}${randomNum}`;

  return username;
}
