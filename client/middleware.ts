import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isJwtExpired(token: string): boolean {
    try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) return true;

        const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
        const payload = JSON.parse(atob(padded));

        if (typeof payload.exp !== "number") return true;

        return payload.exp <= Math.floor(Date.now() / 1000);
    } catch {
        return true;
    }
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isDashboardRoute = pathname.startsWith("/dashboard");

    if (isDashboardRoute && (!token || isJwtExpired(token))) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("token");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
