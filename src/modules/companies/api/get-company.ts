import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, getRecord } from "../../shared/api.js";
import { CompanySchema } from "./list-companies.js";

const getCompanyRoute = createRoute({
	method: "get",
	path: "/api/companies/{id}",
	tags: ["Companies"],
	summary: "Buscar empresa por id",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: { name: "id", in: "path" },
				example: "5872184",
			}),
		}),
	},
	responses: {
		200: {
			description: "Empresa encontrada",
			content: { "application/json": { schema: CompanySchema } },
		},
		404: {
			description: "Empresa nao encontrada",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerGetCompany(app: OpenAPIHono): void {
	app.openapi(getCompanyRoute, (c) => {
		const { id } = c.req.valid("param");
		return c.json(getRecord("companies", id), 200);
	});
}
