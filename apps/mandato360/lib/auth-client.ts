import { createAuthClient } from "better-auth/react";

// Use dynamic URL based on browser location
const getBaseURL = () => {
	if (typeof window !== "undefined") {
		// Use current browser URL
		return window.location.origin;
	}
	// Server-side fallback
	return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";
};

export const authClient = createAuthClient({
	baseURL: getBaseURL(),
});
