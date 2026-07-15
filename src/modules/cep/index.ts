import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Dataset } from "../../lib/types.js";
import { registerGetCep } from "./api/get-cep.js";
import { registerListCeps } from "./api/list-ceps.js";
import { CepPage } from "./docs.js";

export function registerCep(
	app: OpenAPIHono,
	datasets: Map<string, Dataset>,
): void {
	app.get("/cep", (c) => c.html(CepPage()));

	registerListCeps(app, datasets);
	registerGetCep(app, datasets);
}
