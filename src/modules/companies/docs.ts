import { type DocProps, generateDocPage } from "../shared/DocsPage.js";

export const companiesDoc: DocProps = {
	href: "/companies",
	kicker: "Negocios",
	title: "Companies",
	description:
		"Empresas com industria, porte, localizacao e estimativa de funcionarios. Ideal para listagens corporativas e filtros por setor ou pais.",
	fields: [
		{ name: "id", type: "string", note: "chave primaria" },
		{ name: "name", type: "string" },
		{ name: "domain", type: "string", note: "dominio do site" },
		{ name: "year_founded", type: "string" },
		{ name: "industry", type: "string" },
		{ name: "size_range", type: "string", note: "ex.: 10001+" },
		{ name: "locality", type: "string" },
		{ name: "country", type: "string" },
		{ name: "linkedin_url", type: "string" },
		{ name: "current_employee_estimate", type: "string" },
		{ name: "total_employee_estimate", type: "string" },
	],
	routes: [
		{
			method: "GET",
			path: "/api/companies",
			href: "/api/companies?limit=5",
			description:
				"Lista paginada. Query: page, limit e qualquer campo da empresa.",
		},
		{
			method: "GET",
			path: "/api/companies/{id}",
			href: "/api/companies/5872184",
			description: "Busca uma empresa pelo id.",
		},
	],
	examples: [
		{
			method: "GET",
			path: "/api/companies?limit=5",
			href: "/api/companies?limit=5",
			description: "Primeiras 5 empresas.",
		},
		{
			method: "GET",
			path: "/api/companies/5872184",
			href: "/api/companies/5872184",
			description: "IBM (id 5872184).",
		},
		{
			method: "GET",
			path: "/api/companies?industry=banking&limit=5",
			href: "/api/companies?industry=banking&limit=5",
			description: "Filtrar por industry banking.",
		},
		{
			method: "GET",
			path: "/api/companies?country=united%20states&limit=5",
			href: "/api/companies?country=united%20states&limit=5",
			description: "Filtrar por country.",
		},
	],
};

export const companiesDocPage = generateDocPage(companiesDoc);
