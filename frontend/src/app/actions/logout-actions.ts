"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {

    console.log("button clickeddddd")
    const cookieStore = await cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    redirect("/login")
}