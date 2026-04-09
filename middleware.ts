import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Redirect /dashboard to / so it handles tenant routing
	if (pathname === "/dashboard") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Skip auth check for public/static routes to reduce DB queries
	const isPublicRoute = !pathname.includes("/dashboard") && !pathname.startsWith("/master");
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// Optimized session check: skip DB query if no session cookie exists
	const sessionCookie = request.cookies.get("better-auth.session-token") || 
						  request.cookies.get("better-auth.session_token");
	
	const sessionToken = sessionCookie?.value;

	if (!sessionToken) {
		if (pathname.includes("/dashboard") || pathname.startsWith("/master")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		return NextResponse.next();
	}

	let session = null;
	try {
        const url = new URL("/api/auth/get-session", request.url).toString();
		const res = await fetch(url, {
			headers: { cookie: request.headers.get("cookie") || "" },
		});
		if (res.ok) {
			session = await res.json();
		}
	} catch (error: any) {
		if (process.env.NODE_ENV === "development") {
			console.error(`[Middleware] Unexpected error on ${pathname}:`, error.message);
		}
		// Fallback to page-level auth
		return NextResponse.next();
	}

	if (!session) {
		// Only redirect to login if trying to access protected routes
		if (pathname.includes("/dashboard") || pathname.startsWith("/master")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register|$|.*\\..*).*)" ],
};
