"use server"

import {jwtVerify} from "jose"; 

export async function verifyAccessToken(token: string) {
    try{
        const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
        const verified = await jwtVerify(token, key);
        return verified.payload ;
    }catch (error){
        return null;
    }
} 
export async function verifyRefreshToken(token: string) {
    try{
        const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
        const verified = await jwtVerify(token, key);
        return verified.payload ;
    }catch (error){
        return null;
    }
} 



export async function refreshTokens(refreshToken: string) {
    
    //call the backend refresh route get the tokens create new cookies for new tokens

    return null;
}
