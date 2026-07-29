import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerMockMutations } from "../shared/mock-mutations.js";
import { registerGetCep } from "./api/get-cep.js";
import { registerListCeps } from "./api/list-ceps.js";
import { cepDocPage } from "./docs.js";

export function registerCep(app: OpenAPIHono): void {
	app.get("/cep", (c) => c.html(cepDocPage));

	registerListCeps(app);
	registerGetCep(app);
	registerMockMutations(app, {
		name: "code_cep_coordinates",
		tag: "CEP",
	});
}
