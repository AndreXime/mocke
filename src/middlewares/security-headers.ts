import type { OpenAPIHono } from "@hono/zod-openapi";
import { secureHeaders } from "hono/secure-headers";

export function setupSecurityHeaders(app: OpenAPIHono): void {
	app.use(
		"*",
		secureHeaders({
			// API pública com CORS *: precisa permitir leitura cross-origin
			crossOriginResourcePolicy: "cross-origin",
		}),
	);
}
