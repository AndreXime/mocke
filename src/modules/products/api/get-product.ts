import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, getDataset, getRecord } from "../../shared/api.js";
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
		const dataset = getDataset("products");
		if (!dataset)
			return c.json({ error: "Dataset products indisponivel" }, 404);
		const { id } = c.req.valid("param");
		const record = getRecord(dataset, id);
		if (!record) return c.json({ error: `Produto nao encontrado: ${id}` }, 404);
		return c.json(ProductSchema.parse(record), 200);
	});
}
