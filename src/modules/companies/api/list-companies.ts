import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, listPage, pageResultSchema } from "../../shared/api.js";

export const CompanySchema = z
	.object({
		id: z.string().openapi({ example: "5872184" }),
		name: z.string().openapi({ example: "ibm" }),
		domain: z.string().openapi({ example: "ibm.com" }),
		year_founded: z.string().openapi({ example: "1911.0" }),
		industry: z
			.string()
			.openapi({ example: "information technology and services" }),
		size_range: z.string().openapi({ example: "10001+" }),
		locality: z
			.string()
			.openapi({ example: "new york, new york, united states" }),
		country: z.string().openapi({ example: "united states" }),
		linkedin_url: z.string().openapi({ example: "linkedin.com/company/ibm" }),
		current_employee_estimate: z.string().openapi({ example: "274047" }),
		total_employee_estimate: z.string().openapi({ example: "716906" }),
	})
	.openapi("Company");

export type Company = z.infer<typeof CompanySchema>;

const listCompaniesRoute = createRoute({
	method: "get",
	path: "/api/companies",
	tags: ["Companies"],
	summary: "Listar empresas",
	description:
		"Empresas com industria, porte e localizacao. Filtre por igualdade em qualquer campo, ex.: industry, country, size_range. Valores separados por virgula no mesmo campo fazem OR.",
	request: {
		query: z
			.object({
				page: z.string().optional().openapi({ example: "1" }),
				limit: z.string().optional().openapi({ example: "20" }),
				industry: z.string().optional().openapi({
					example: "information technology and services",
				}),
				country: z.string().optional().openapi({ example: "united states" }),
				size_range: z.string().optional().openapi({ example: "10001+" }),
				name: z.string().optional(),
			})
			.passthrough(),
	},
	responses: {
		200: {
			description: "Pagina de empresas",
			content: {
				"application/json": {
					schema: pageResultSchema(CompanySchema, "CompanyPage"),
				},
			},
		},
		404: {
			description: "Dataset indisponivel",
			content: { "application/json": { schema: ErrorSchema } },
		},
	},
});

export function registerListCompanies(app: OpenAPIHono): void {
	app.openapi(listCompaniesRoute, (c) => {
		return c.json(listPage("companies", c.req.url), 200);
	});
}
