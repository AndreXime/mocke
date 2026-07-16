import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, getRecord } from "../../shared/api.js";
import { NewsArticleSchema } from "./list-news.js";

const getNewsRoute = createRoute({
	method: "get",
	path: "/api/news/{id}",
	tags: ["News"],
	summary: "Buscar noticia por id",
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
			description: "Noticia encontrada",
			content: { "application/json": { schema: NewsArticleSchema } },
		},
		404: {
			description: "Noticia nao encontrada",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerGetNews(app: OpenAPIHono): void {
	app.openapi(getNewsRoute, (c) => {
		const { id } = c.req.valid("param");
		const record = getRecord("news", id);
		if (record === null)
			return c.json({ error: "Dataset news indisponivel" }, 404);
		if (!record)
			return c.json(
				{ error: `Item com id ${id} nao encontrado no dataset news` },
				404,
			);
		return c.json(NewsArticleSchema.parse(record), 200);
	});
}
