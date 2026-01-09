"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { User } from "@/shared/types/userTypes"; 

export async function getUserFromServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("accessToken");

  if (!cookie) return null;

  try {
    const decoded = jwt.decode(cookie.value) as User | null;
    return decoded;
  } catch {
    return null;
  }
}
