import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (isDashboardRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
