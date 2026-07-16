import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, getRecord } from "../../shared/api.js";
import { CepCoordinateSchema } from "./list-ceps.js";

const getCepRoute = createRoute({
	method: "get",
	path: "/api/code_cep_coordinates/{id}",
	tags: ["CEPs"],
	summary: "Buscar CEP por POSTCODE",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: { name: "id", in: "path" },
				example: "01310",
				description: "POSTCODE (chave do registro)",
			}),
		}),
	},
	responses: {
		200: {
			description: "CEP encontrado",
			content: { "application/json": { schema: CepCoordinateSchema } },
		},
		404: {
			description: "CEP nao encontrado",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerGetCep(app: OpenAPIHono): void {
	app.openapi(getCepRoute, (c) => {
		const { id } = c.req.valid("param");
		const record = getRecord("code_cep_coordinates", id);
		if (record === null) {
			return c.json(
				{ error: "Dataset code_cep_coordinates indisponivel" },
				404,
			);
		}
		if (!record) {
			return c.json(
				{
					error: `Item com id ${id} nao encontrado no dataset code_cep_coordinates`,
				},
				404,
			);
		}
		return c.json(CepCoordinateSchema.parse(record), 200);
	});
}
