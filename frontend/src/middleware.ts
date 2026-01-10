import { NextRequest, NextResponse } from "next/server";
import { refreshTokens, verifyAccessToken, verifyRefreshToken } from "./app/actions/authentication/session-actions";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    //remove unwanted executuion
    if (pathname.includes("_next") || pathname.includes("favicon")) return NextResponse.next();

    const accessToken = req.cookies.get("accessToken")?.value || "";

    const accessTokenPayload = await verifyAccessToken(accessToken)
    let user = null;

    if (accessTokenPayload) {
        user = accessTokenPayload;
    } else {
        const refreshToken = req.cookies.get("refreshToken")?.value || "";
        const refreshTokenPayload = await verifyRefreshToken(refreshToken)
        if (refreshTokenPayload) {
            await refreshTokens(refreshToken);
            user = refreshTokenPayload;
        }
    }

    const publicRoutes = ["/login", "/signup",];

    const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path)) || pathname === "/";

    if (!user) {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL("/login", req.url))
        }
        return NextResponse.next();
    }

    if (user) {
        if (isPublicRoute) {
            return NextResponse.redirect(new URL(`/${user.role}`, req.url));
        }

        if (pathname.startsWith(`/${user.role}`)) {
            return NextResponse.next();
        }

        if (pathname === "/") {
            return NextResponse.next();
        }

        if (!pathname.startsWith(`/${user.role}`)) {
            return NextResponse.redirect(new URL(`/${user.role}`, req.url));
        }
    }

    return NextResponse.next();
}



export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|_next/internal|BgVector.jpg).*)",
    ],
};