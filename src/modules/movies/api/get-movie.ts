import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, getRecord } from "../../shared/api.js";
import { MovieSchema } from "./list-movies.js";

const getMovieRoute = createRoute({
	method: "get",
	path: "/api/movies/{id}",
	tags: ["Movies"],
	summary: "Buscar filme por id",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: { name: "id", in: "path" },
				example: "19995",
			}),
		}),
	},
	responses: {
		200: {
			description: "Filme encontrado",
			content: { "application/json": { schema: MovieSchema } },
		},
		404: {
			description: "Filme nao encontrado",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerGetMovie(app: OpenAPIHono): void {
	app.openapi(getMovieRoute, (c) => {
		const { id } = c.req.valid("param");
		return c.json(getRecord("movies", id), 200);
	});
}
