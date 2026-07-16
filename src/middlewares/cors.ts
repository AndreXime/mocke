import type { OpenAPIHono } from "@hono/zod-openapi";

export function setupCors(app: OpenAPIHono) {
	app.use("*", async (c, next) => {
		await next();
		c.header("Access-Control-Allow-Origin", "*");
		c.header("Access-Control-Allow-Methods", "GET, OPTIONS");
		c.header("Access-Control-Allow-Headers", "Content-Type");
		c.header(
			"Access-Control-Expose-Headers",
			"X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After",
		);
	});

	app.options("*", (c) => c.body(null, 204));
}
