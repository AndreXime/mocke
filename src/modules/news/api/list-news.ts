import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, listPage, pageResultSchema } from "../../shared/api.js";

export const NewsArticleSchema = z
	.object({
		id: z.string().openapi({ example: "1" }),
		title: z.string().openapi({
			example:
				"As U.S. budget fight looms, Republicans flip their fiscal script",
		}),
		text: z.string(),
		subject: z.string().openapi({ example: "politicsNews" }),
		date: z.string().openapi({ example: "December 31, 2017" }),
	})
	.openapi("NewsArticle");

const listNewsRoute = createRoute({
	method: "get",
	path: "/api/news",
	tags: ["News"],
	summary: "Listar noticias",
	description:
		"Artigos de noticia (CSV). Filtre por igualdade em title, text, subject ou date. Valores separados por virgula no mesmo campo fazem OR.",
	request: {
		query: z
			.object({
				page: z.string().optional().openapi({ example: "1" }),
				limit: z.string().optional().openapi({ example: "20" }),
				subject: z.string().optional().openapi({ example: "politicsNews" }),
				date: z.string().optional().openapi({ example: "December 31, 2017" }),
				title: z.string().optional(),
			})
			.passthrough(),
	},
	responses: {
		200: {
			description: "Pagina de noticias",
			content: {
				"application/json": {
					schema: pageResultSchema(NewsArticleSchema, "NewsArticlePage"),
				},
			},
		},
		404: {
			description: "Dataset indisponivel",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerListNews(app: OpenAPIHono): void {
	app.openapi(listNewsRoute, (c) => {
		const page = listPage("news", c.req.url);
		if (!page) {
			return c.json({ error: "Dataset news indisponivel" }, 404);
		}
		return c.json(
			{
				...page,
				data: page.data.map((row) => NewsArticleSchema.parse(row)),
			},
			200,
		);
	});
}
