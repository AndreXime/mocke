import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Dataset } from "../../lib/types.js";
import { registerGetCep } from "./api/get-cep.js";
import { registerListCeps } from "./api/list-ceps.js";
import { CepPage } from "./page.js";

export function registerCep(
	app: OpenAPIHono,
	datasets: Map<string, Dataset>,
): void {
	app.get("/cep", (c) => {
		const dataset = datasets.get("code_cep_coordinates");
		return c.html(CepPage({ count: dataset?.records.length ?? 0 }));
	});

	registerListCeps(app, datasets);
	registerGetCep(app, datasets);
}
