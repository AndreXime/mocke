import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, listPage, pageResultSchema } from "../../shared/api.js";

export const UserSchema = z
	.object({
		id: z.string().openapi({ example: "1" }),
		first_name: z.string().openapi({ example: "Alexander" }),
		last_name: z.string().openapi({ example: "Barrett" }),
		email: z.string().openapi({ example: "alexander.barrett@example.com" }),
		username: z.string().openapi({ example: "happylion648" }),
		gender: z.string().openapi({ example: "male" }),
		age: z.string().openapi({ example: "49" }),
		birth_date: z.string().openapi({ example: "1976-08-12" }),
		phone: z.string(),
		cell: z.string(),
		street: z.string(),
		city: z.string().openapi({ example: "Toledo" }),
		state: z.string().openapi({ example: "Ohio" }),
		country: z.string().openapi({ example: "United States" }),
		postcode: z.string(),
		latitude: z.string(),
		longitude: z.string(),
		nationality: z.string().openapi({ example: "US" }),
		picture: z.string(),
		registered_at: z.string().openapi({ example: "2012-10-26" }),
	})
	.openapi("User");

export type User = z.infer<typeof UserSchema>;

const listUsersRoute = createRoute({
	method: "get",
	path: "/api/users",
	tags: ["Users"],
	summary: "Listar usuarios",
	description:
		"Usuarios fake (estilo randomuser). Filtre por igualdade em qualquer campo, ex.: gender, nationality, country, city. Valores separados por virgula no mesmo campo fazem OR.",
	request: {
		query: z
			.object({
				page: z.string().optional().openapi({ example: "1" }),
				limit: z.string().optional().openapi({ example: "20" }),
				gender: z.string().optional().openapi({ example: "female" }),
				nationality: z.string().optional().openapi({ example: "US" }),
				country: z.string().optional().openapi({ example: "United States" }),
				city: z.string().optional(),
			})
			.passthrough(),
	},
	responses: {
		200: {
			description: "Pagina de usuarios",
			content: {
				"application/json": {
					schema: pageResultSchema(UserSchema, "UserPage"),
				},
			},
		},
		404: {
			description: "Dataset indisponivel",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerListUsers(app: OpenAPIHono): void {
	app.openapi(listUsersRoute, (c) => {
		return c.json(listPage("users", c.req.url), 200);
	});
}
