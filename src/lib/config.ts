export const config = {
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
};

export function assertConfig() {
	if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
		// Fallback is fine for local dev; warn in console at runtime
		if (typeof window !== "undefined") {
			console.warn("NEXT_PUBLIC_API_BASE_URL is not set. Using default http://localhost:3001");
		}
	}
} 