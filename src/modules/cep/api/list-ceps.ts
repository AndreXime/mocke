import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import type { Dataset } from "../../../lib/types.js";
import {
	ErrorSchema,
	getDataset,
	listPage,
	pageResultSchema,
} from "../../shared/api.js";

export const CepCoordinateSchema = z
	.object({
		POSTCODE: z.string().openapi({ example: "01310" }),
		LON: z.string().openapi({ example: "-46.6480678" }),
		LAT: z.string().openapi({ example: "-23.5681931" }),
	})
	.openapi("CepCoordinate");

const listCepsRoute = createRoute({
	method: "get",
	path: "/api/code_cep_coordinates",
	tags: ["CEPs"],
	summary: "Listar CEPs com coordenadas",
	description:
		"Tabela de CEP brasileiro com longitude e latitude. Filtre por POSTCODE, LON ou LAT.",
	request: {
		query: z
			.object({
				page: z.string().optional().openapi({ example: "1" }),
				limit: z.string().optional().openapi({ example: "20" }),
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

export function registerListCeps(
	app: OpenAPIHono,
	datasets: Map<string, Dataset>,
): void {
	app.openapi(listCepsRoute, (c) => {
		const dataset = getDataset(datasets, "code_cep_coordinates");
		if (!dataset) {
			return c.json(
				{ error: "Dataset code_cep_coordinates indisponivel" },
				404,
			);
		}
		const page = listPage(dataset, c.req.url);
		return c.json(
			{
				...page,
				data: page.data.map((row) => CepCoordinateSchema.parse(row)),
			},
			200,
		);
	});
}
