import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerGetCep } from "./api/get-cep.js";
import { registerListCeps } from "./api/list-ceps.js";
import { cepDocPage } from "./docs.js";

export function registerCep(app: OpenAPIHono): void {
	app.get("/cep", (c) => c.html(cepDocPage));

	registerListCeps(app);
	registerGetCep(app);
}
