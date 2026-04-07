import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Redirect /dashboard to / so it handles tenant routing
	if (pathname === "/dashboard") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session) {
		// Only redirect to login if trying to access dashboard routes
		if (pathname.includes("/dashboard")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register|$).*)"],
};
