import { auth } from "@/lib/auth";
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

	let session = null;
	try {
		// Race against a timeout to prevent middleware from hanging
		const sessionPromise = auth.api.getSession({
			headers: request.headers,
		});
		const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
		session = await Promise.race([sessionPromise, timeoutPromise]);
	} catch (error: any) {
		// Silently handle transient DB errors — page-level auth will catch these
		if (process.env.NODE_ENV === "development") {
			console.warn(`[Middleware] Auth transient error on ${pathname}: ${error.message}`);
		}
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
