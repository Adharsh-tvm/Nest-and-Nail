import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDynamicServerError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const error = err as Record<string, unknown>;
  return (
    error.digest === "DYNAMIC_SERVER_USAGE" ||
    (typeof error.digest === "string" && error.digest.startsWith("NEXT_")) ||
    (typeof error.message === "string" && (
      error.message.includes("dynamic-server-error") ||
      error.message.includes("Dynamic server usage")
    ))
  );
}

