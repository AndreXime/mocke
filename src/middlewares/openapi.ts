import { swaggerUI } from "@hono/swagger-ui";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { catalog } from "../modules/shared/catalog.js";

export function setupOpenApi(app: OpenAPIHono) {
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
}
