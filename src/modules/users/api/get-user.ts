import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, getRecord } from "../../shared/api.js";
import { UserSchema } from "./list-users.js";

const getUserRoute = createRoute({
	method: "get",
	path: "/api/users/{id}",
	tags: ["Users"],
	summary: "Buscar usuario por id",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: { name: "id", in: "path" },
				example: "1",
			}),
		}),
	},
	responses: {
		200: {
			description: "Usuario encontrado",
			content: { "application/json": { schema: UserSchema } },
		},
		404: {
			description: "Usuario nao encontrado",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerGetUser(app: OpenAPIHono): void {
	app.openapi(getUserRoute, (c) => {
		const { id } = c.req.valid("param");
		const record = getRecord("users", id);
		return c.json(UserSchema.parse(record), 200);
	});
}
