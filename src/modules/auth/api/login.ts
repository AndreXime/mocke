import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";

export const LoginResponseSchema = z
	.object({
		token: z.string().openapi({ example: "mock-token" }),
		tokenType: z.string().openapi({ example: "Bearer" }),
	})
	.openapi("LoginResponse");

const loginRoute = createRoute({
	method: "post",
	path: "/api/auth/login",
	tags: ["Auth"],
	summary: "Login mock",
	description: "Aceita qualquer body. Sempre devolve mock-token.",
	responses: {
		200: {
			description: "Token mock",
			content: { "application/json": { schema: LoginResponseSchema } },
		},
	},
});

export function registerLogin(app: OpenAPIHono): void {
	app.openapi(loginRoute, (c) => {
		return c.json({ token: "mock-token", tokenType: "Bearer" }, 200);
	});
}
