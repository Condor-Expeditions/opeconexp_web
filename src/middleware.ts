import { defineMiddleware } from "astro:middleware";

const securityHeaders = {
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy":
		"camera=(), microphone=(), geolocation=(self), interest-cohort=()",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

export const onRequest = defineMiddleware((_context, next) => {
	const response = next();

	if (response instanceof Response) {
		for (const [key, value] of Object.entries(securityHeaders)) {
			if (!response.headers.get(key)) {
				response.headers.set(key, value);
			}
		}
	}

	return response;
});
