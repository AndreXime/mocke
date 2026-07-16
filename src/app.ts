import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "hono/bun";
import { setupCors } from "./lib/cors.js";
import { setupErrorHandler } from "./lib/errors.js";
import { setupOpenApi } from "./lib/openapi.js";
import { setupRateLimit } from "./lib/rate-limit.js";
import { registerCep } from "./modules/cep/index.js";
import { registerCompanies } from "./modules/companies/index.js";
import { registerMovies } from "./modules/movies/index.js";
import { registerNews } from "./modules/news/index.js";
import { registerProducts } from "./modules/products/index.js";
import { HomePage } from "./modules/shared/HomePage.js";
import { registerUsers } from "./modules/users/index.js";

export default function setupApp() {
	const app = new OpenAPIHono();

	setupCors(app);
	setupRateLimit(app);
	setupErrorHandler(app);

	app.use("/assets/*", serveStatic({ root: import.meta.dir }));
	app.get("/", (c) => c.html(HomePage));

	registerProducts(app);
	registerCep(app);
	registerNews(app);
	registerMovies(app);
	registerUsers(app);
	registerCompanies(app);

	setupOpenApi(app);

	return app;
}
