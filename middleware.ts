import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Redirect /dashboard to / so it handles tenant routing
	if (pathname === "/dashboard") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	let session = null;
	try {
		session = await auth.api.getSession({
			headers: request.headers,
		});
	} catch (error) {
		console.error("Middleware Auth Error (Transient):", error);
		// Allow request to proceed on transient DB errors
		// Protection will still happen via Layout/Page server checks
		return NextResponse.next();
	}

	if (!session) {
		// Only redirect to login if trying to access dashboard or master routes
		if (pathname.includes("/dashboard") || pathname.startsWith("/master")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register|$|.*\\..*).*)"],
};
