import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "better-auth/types";

export default async function authMiddleware(request: NextRequest) {
    // Playwright Bypass (Dev only)
    if (process.env.NODE_ENV === "development" && (request.headers.get("x-playwright-test") === "true" || request.nextUrl.searchParams.get("test") === "true")) {
        return NextResponse.next();
    }

    const { data: authData } = await betterFetch<any>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    const pathname = request.nextUrl.pathname;
    
    // console.log(`[Middleware] Path: ${pathname}, Role: ${authData?.user?.role}`);

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/registro");
    const isCheckoutPage = pathname.startsWith("/checkout");
    const isDashboardPage = pathname.startsWith("/painel") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/editar-site");
    const isVerificationPage = pathname.startsWith("/verificar-email") || pathname.startsWith("/confirmar");
    const isAdminPage = pathname.startsWith("/admin");

    // ─── Not authenticated ─────────────────────────────────────
    if (!authData) {
        if (isDashboardPage || isAdminPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Checkout requires auth → redirect to REGISTER (not login) preserving plan param
        if (isCheckoutPage) {
            const plan = request.nextUrl.searchParams.get("plan") || "";
            const redirectUrl = new URL("/registro", request.url);
            if (plan) redirectUrl.searchParams.set("plan", plan);
            return NextResponse.redirect(redirectUrl);
        }

        return NextResponse.next();
    }

    // ─── Already authenticated ─────────────────────────────────
    if (authData) {
        const isVerified = authData.user?.emailVerified === true;
        const role = authData.user?.role;

        // HIGH PRIORITY: Root users always go to /admin if they try to access standard dashboard or auth pages
        if (role === "root" && (isAuthPage || pathname.startsWith("/onboarding") || pathname.startsWith("/painel"))) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        // If trying to access admin and not root
        if (isAdminPage && role !== "root") {
            return NextResponse.redirect(new URL("/painel", request.url));
        }

        // If not verified and trying to access dashboard/checkout
        if (!isVerified && (isDashboardPage || isCheckoutPage) && !isVerificationPage) {
            return NextResponse.redirect(new URL("/verificar-email", request.url));
        }


        if (isAuthPage) {
            // If register/login page has a plan param → go to checkout
            const plan = request.nextUrl.searchParams.get("plan");
            if (plan) {
                const checkoutUrl = new URL("/checkout", request.url);
                checkoutUrl.searchParams.set("plan", plan);
                return NextResponse.redirect(checkoutUrl);
            }
            return NextResponse.redirect(new URL("/painel", request.url));
        }

    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/painel/:path*", 
        "/onboarding/:path*", 
        "/onboarding",
        "/login", 
        "/registro", 
        "/editar-site/:path*", 
        "/checkout", 
        "/checkout/:path*", 
        "/confirmar", 
        "/verificar-email/:path*",
        "/verificar-email",
        "/admin/:path*"
    ],
};
