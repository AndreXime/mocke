import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, listPage, pageResultSchema } from "../../shared/api.js";

export const ProductSchema = z
	.object({
		id: z.string().openapi({ example: "B091F3YVH6" }),
		source: z.string().openapi({ example: "amazon" }),
		title: z.string(),
		description: z.string(),
		brand: z.string(),
		category: z.string().openapi({ example: "Abrasive & Finishing Products" }),
		price: z.string(),
		listPrice: z.string(),
		packSize: z.string(),
		images: z.string(),
		url: z.string(),
		stars: z.string(),
		reviews: z.string(),
		inStock: z.string().openapi({ example: "True" }),
		isBestSeller: z.string().openapi({ example: "False" }),
		boughtInLastMonth: z.string(),
	})
	.openapi("Product");

const listProductsRoute = createRoute({
	method: "get",
	path: "/api/products",
	tags: ["Products"],
	summary: "Listar produtos",
	description:
		"Catalogo de produtos (CSV Amazon). Filtre por igualdade em qualquer campo, ex: category, brand, inStock. Valores separados por virgula no mesmo campo fazem OR.",
	request: {
		query: z
			.object({
				page: z.string().optional().openapi({ example: "1" }),
				limit: z.string().optional().openapi({ example: "20" }),
				category: z.string().optional().openapi({
					example: "Women's Clothing,Women's Shoes",
					description: "Uma category ou varias separadas por virgula (OR).",
				}),
				brand: z.string().optional(),
				inStock: z.string().optional().openapi({ example: "True" }),
				isBestSeller: z.string().optional().openapi({ example: "False" }),
				source: z.string().optional().openapi({ example: "amazon" }),
			})
			.passthrough(),
	},
	responses: {
		200: {
			description: "Pagina de produtos",
			content: {
				"application/json": {
					schema: pageResultSchema(ProductSchema, "ProductPage"),
				},
			},
		},
		404: {
			description: "Dataset indisponivel",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerListProducts(app: OpenAPIHono): void {
	app.openapi(listProductsRoute, (c) => {
		const page = listPage("products", c.req.url);
		return c.json(
			{
				...page,
				data: page.data.map((row) => ProductSchema.parse(row)),
			},
			200,
		);
	});
}
