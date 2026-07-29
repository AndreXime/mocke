import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { HTTPError } from "../../../middlewares/errors.js";
import { ErrorSchema } from "../../shared/api.js";

export const MockUserSchema = z
	.object({
		id: z.string().openapi({ example: "1" }),
		name: z.string().openapi({ example: "Mock User" }),
		email: z.string().openapi({ example: "mock@example.com" }),
	})
	.openapi("MockUser");

const meRoute = createRoute({
	method: "get",
	path: "/api/auth/me",
	tags: ["Auth"],
	summary: "Usuario autenticado mock",
	description:
		"Sem Bearer → 401. Bearer forbidden → 403. Qualquer outro Bearer → user mock.",
	responses: {
		200: {
			description: "Usuario mock",
			content: { "application/json": { schema: MockUserSchema } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: ErrorSchema } },
		},
		403: {
			description: "Forbidden",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerMe(app: OpenAPIHono): void {
	app.openapi(meRoute, (c) => {
		const header = c.req.header("authorization");
		if (!header) {
			throw new HTTPError(401, "Unauthorized");
		}
		const [scheme, token] = header.split(/\s+/, 2);
		if (scheme?.toLowerCase() !== "bearer" || !token) {
			throw new HTTPError(401, "Unauthorized");
		}
		if (token === "forbidden") {
			throw new HTTPError(403, "Forbidden");
		}
		return c.json(
			{ id: "1", name: "Mock User", email: "mock@example.com" },
			200,
		);
	});
}
