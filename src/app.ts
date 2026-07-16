import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveStatic } from "@hono/node-server/serve-static";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { setupCors } from "./lib/cors.js";
import { registerCep } from "./modules/cep/index.js";
import { registerHome } from "./modules/home/index.js";
import { registerProducts } from "./modules/products/index.js";

const staticRoot = path.dirname(fileURLToPath(import.meta.url));

export default function setupApp() {
	const app = new OpenAPIHono();

	setupCors(app);

	app.use("/assets/*", serveStatic({ root: staticRoot }));

	registerHome(app);
	registerProducts(app);
	registerCep(app);

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
		],
	});

	app.get("/docs", swaggerUI({ url: "/openapi.json" }));

	return app;
}
