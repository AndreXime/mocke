import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, getRecord } from "../../shared/api.js";
import { ProductSchema } from "./list-products.js";

const getProductRoute = createRoute({
	method: "get",
	path: "/api/products/{id}",
	tags: ["Products"],
	summary: "Buscar produto por id",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: { name: "id", in: "path" },
				example: "B091F3YVH6",
			}),
		}),
		query: z.object({
			fields: z.string().optional().openapi({
				example: "id,title",
				description: "Projecao CSV de campos na resposta.",
			}),
		}),
	},
	responses: {
		200: {
			description: "Produto encontrado",
			content: { "application/json": { schema: ProductSchema } },
		},
		404: {
			description: "Produto nao encontrado",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerGetProduct(app: OpenAPIHono): void {
	app.openapi(getProductRoute, (c) => {
		const { id } = c.req.valid("param");
		return c.json(getRecord("products", id, c.req.url), 200);
	});
}
