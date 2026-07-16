import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerGetMovie } from "./api/get-movie.js";
import { registerListMovies } from "./api/list-movies.js";
import { moviesDocsPage } from "./docs.js";

export function registerMovies(app: OpenAPIHono): void {
	app.get("/movies", (c) => c.html(moviesDocsPage));

	registerListMovies(app);
	registerGetMovie(app);
}
