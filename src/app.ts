import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "hono/bun";
import { setupCors } from "./lib/cors.js";
import { setupErrorHandler } from "./lib/errors.js";
import { registerCep } from "./modules/cep/index.js";
import { registerHome } from "./modules/home/index.js";
import { registerMovies } from "./modules/movies/index.js";
import { registerNews } from "./modules/news/index.js";
import { registerProducts } from "./modules/products/index.js";

export default function setupApp() {
	const app = new OpenAPIHono();

	setupCors(app);
	setupErrorHandler(app);

	app.use("/assets/*", serveStatic({ root: import.meta.dir }));

	registerHome(app);
	registerProducts(app);
	registerCep(app);
	registerNews(app);
	registerMovies(app);

	app.doc("/openapi.json", {
		openapi: "3.1.0",
		info: {
			title: "Mockê",
			version: "1.0.0",
			description:
				"API publica de mocks. Cada arquivo em /data vira um dataset com paginacao e filtros por igualdade de campo. Valores separados por virgula no mesmo campo fazem OR.",
		},
		tags: [
			{
				name: "Products",
				description: "Produtos de e-commerce com filtros por campo",
			},
			{ name: "CEPs", description: "CEP com coordenadas" },
			{
				name: "News",
				description: "Noticias com filtros por subject e date",
			},
			{
				name: "Movies",
				description: "Filmes TMDB com generos, elenco e diretores",
			},
		],
	});

	app.get("/docs", swaggerUI({ url: "/openapi.json" }));

	return app;
}
