import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import {
	ErrorSchema,
	listPage,
	listQueryExtrasSchema,
	pageResultSchema,
} from "../../shared/api.js";

export const CepCoordinateSchema = z
	.object({
		POSTCODE: z.string().openapi({ example: "01310" }),
		LON: z.string().openapi({ example: "-46.6480678" }),
		LAT: z.string().openapi({ example: "-23.5681931" }),
	})
	.openapi("CepCoordinate");

export type CepCoordinate = z.infer<typeof CepCoordinateSchema>;

const listCepsRoute = createRoute({
	method: "get",
	path: "/api/code_cep_coordinates",
	tags: ["CEP"],
	summary: "Listar CEPs com coordenadas",
	description:
		"Tabela de CEP brasileiro com longitude e latitude. Filtre por POSTCODE, LON ou LAT. Use q/search, searchFields, sort, order e fields.",
	request: {
		query: listQueryExtrasSchema
			.extend({
				POSTCODE: z.string().optional().openapi({ example: "01310" }),
				LON: z.string().optional(),
				LAT: z.string().optional(),
			})
			.passthrough(),
	},
	responses: {
		200: {
			description: "Pagina de CEPs",
			content: {
				"application/json": {
					schema: pageResultSchema(CepCoordinateSchema, "CepCoordinatePage"),
				},
			},
		},
		404: {
			description: "Dataset indisponivel",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerListCeps(app: OpenAPIHono): void {
	app.openapi(listCepsRoute, (c) => {
		return c.json(listPage("code_cep_coordinates", c.req.url), 200);
	});
}
