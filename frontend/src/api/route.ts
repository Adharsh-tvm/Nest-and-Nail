/**
 * Handles user login by forwarding credentials to the backend.
 * * This API route receives a POST request with email and password.
 * It validates these credentials against the main backend.
 * If successful, it sets secure, HttpOnly 'access' and 'refresh'
 * tokens as cookies in the response.
 */
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json(); 
  
  const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const { accessToken, refreshToken, accessExpiresIn, refreshExpiresIn } = await res.json();

  const response = NextResponse.json({ ok: true });

  response.cookies.set('access', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: accessExpiresIn, // seconds
  });

  response.cookies.set('refresh', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: refreshExpiresIn, // seconds
  });

  return response;
}