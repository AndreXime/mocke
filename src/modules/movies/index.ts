import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerMockMutations } from "../shared/mock-mutations.js";
import { registerGetMovie } from "./api/get-movie.js";
import { registerListMovies } from "./api/list-movies.js";
import { moviesDocPage } from "./docs.js";

export function registerMovies(app: OpenAPIHono): void {
	app.get("/movies", (c) => c.html(moviesDocPage));

	registerListMovies(app);
	registerGetMovie(app);
	registerMockMutations(app, { name: "movies", tag: "Movies" });
}
