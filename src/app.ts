import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "hono/bun";
import { setupCors } from "./lib/cors.js";
import { setupErrorHandler } from "./lib/errors.js";
import { registerCep } from "./modules/cep/index.js";
import { registerMovies } from "./modules/movies/index.js";
import { registerNews } from "./modules/news/index.js";
import { registerProducts } from "./modules/products/index.js";
import { catalog } from "./modules/shared/catalog.js";
import { HomePage } from "./modules/shared/HomePage.js";
import { registerUsers } from "./modules/users/index.js";

export default function setupApp() {
	const app = new OpenAPIHono();

	setupCors(app);
	setupErrorHandler(app);

	app.use("/assets/*", serveStatic({ root: import.meta.dir }));
	app.get("/", (c) => c.html(HomePage));

	registerProducts(app);
	registerCep(app);
	registerNews(app);
	registerMovies(app);
	registerUsers(app);

	app.doc("/openapi.json", {
		openapi: "3.1.0",
		info: {
			title: "Mockê",
			version: "1.0.0",
			description:
				"API publica de mocks. Cada arquivo em /data vira um dataset com paginacao e filtros por igualdade de campo. Valores separados por virgula no mesmo campo fazem OR.",
		},
		tags: catalog.map((dataset) => ({
			name: dataset.title,
			description: dataset.description,
		})),
	});

	app.get("/docs", swaggerUI({ url: "/openapi.json" }));

	return app;
}
