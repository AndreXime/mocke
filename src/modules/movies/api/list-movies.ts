import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import {
	ErrorSchema,
	listPage,
	listQueryExtrasSchema,
	pageResultSchema,
} from "../../shared/api.js";

export const MovieSchema = z
	.object({
		id: z.string().openapi({ example: "19995" }),
		title: z.string().openapi({ example: "Avatar" }),
		original_title: z.string().openapi({ example: "Avatar" }),
		original_language: z.string().openapi({ example: "en" }),
		overview: z.string(),
		tagline: z.string().openapi({ example: "Enter the World of Pandora." }),
		status: z.string().openapi({ example: "Released" }),
		release_date: z.string().openapi({ example: "2009-12-10" }),
		runtime: z.string().openapi({ example: "162" }),
		budget: z.string().openapi({ example: "237000000" }),
		revenue: z.string().openapi({ example: "2787965087" }),
		popularity: z.string(),
		vote_average: z.string().openapi({ example: "7.2" }),
		vote_count: z.string().openapi({ example: "11800" }),
		homepage: z.string(),
		genres: z
			.string()
			.openapi({ example: "Action,Adventure,Fantasy,Science Fiction" }),
		keywords: z.string(),
		production_companies: z.string(),
		production_countries: z.string(),
		spoken_languages: z.string().openapi({ example: "English,Espanol" }),
		cast: z.string().openapi({
			example: "Sam Worthington,Zoe Saldana,Sigourney Weaver",
		}),
		directors: z.string().openapi({ example: "James Cameron" }),
	})
	.openapi("Movie");

export type Movie = z.infer<typeof MovieSchema>;

const listMoviesRoute = createRoute({
	method: "get",
	path: "/api/movies",
	tags: ["Movies"],
	summary: "Listar filmes",
	description:
		"Catalogo TMDB 5000. Filtre por igualdade em qualquer campo (ex.: genres, original_language, directors, cast). Valores separados por virgula no mesmo campo fazem OR; em listas (genres, cast) tambem encontra o item dentro da celula. Use q/search, searchFields, sort, order e fields.",
	request: {
		query: listQueryExtrasSchema
			.extend({
				genres: z.string().optional().openapi({
					example: "Action,Comedy",
					description: "Um genero ou varios separados por virgula (OR).",
				}),
				original_language: z.string().optional().openapi({ example: "en" }),
				status: z.string().optional().openapi({ example: "Released" }),
				directors: z.string().optional().openapi({ example: "James Cameron" }),
				cast: z.string().optional().openapi({ example: "Sam Worthington" }),
				title: z.string().optional(),
			})
			.passthrough(),
	},
	responses: {
		200: {
			description: "Pagina de filmes",
			content: {
				"application/json": {
					schema: pageResultSchema(MovieSchema, "MoviePage"),
				},
			},
		},
		404: {
			description: "Dataset indisponivel",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerListMovies(app: OpenAPIHono): void {
	app.openapi(listMoviesRoute, (c) => {
		return c.json(listPage("movies", c.req.url), 200);
	});
}
