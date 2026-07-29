import { type DocProps, generateDocPage } from "../shared/DocsPage.js";

export const cepDoc: DocProps = {
	href: "/cep",
	kicker: "Geo Brasil",
	title: "CEP",
	description:
		"Tabela de CEP brasileiro com coordenadas. Ideal para frete, mapas, autocomplete e validacao de endereco.",
	fields: [
		{ name: "POSTCODE", type: "string", note: "chave primaria (CEP)" },
		{ name: "LON", type: "string", note: "longitude" },
		{ name: "LAT", type: "string", note: "latitude" },
	],
	routes: [
		{
			method: "GET",
			path: "/api/code_cep_coordinates",
			href: "/api/code_cep_coordinates?limit=5",
			description:
				"Lista paginada. Query: page, limit, q/search, searchFields, sort, order, fields, POSTCODE, LON, LAT.",
		},
		{
			method: "GET",
			path: "/api/code_cep_coordinates/{id}",
			href: "/api/code_cep_coordinates/01310",
			description: "Busca um CEP pelo POSTCODE. Query opcional: fields.",
		},
		{
			method: "POST",
			path: "/api/code_cep_coordinates",
			href: "/api/code_cep_coordinates",
			description:
				"Mock create: 201 { ok: true }. Nao persiste. Query fail=0..1 para 500 probabilistico.",
		},
		{
			method: "PUT",
			path: "/api/code_cep_coordinates/{id}",
			href: "/api/code_cep_coordinates/01310",
			description: "Mock replace: 200 { ok: true }. Nao persiste.",
		},
		{
			method: "PATCH",
			path: "/api/code_cep_coordinates/{id}",
			href: "/api/code_cep_coordinates/01310",
			description: "Mock patch: 200 { ok: true }. Nao persiste.",
		},
		{
			method: "DELETE",
			path: "/api/code_cep_coordinates/{id}",
			href: "/api/code_cep_coordinates/01310",
			description: "Mock delete: 204. Nao persiste.",
		},
	],
	examples: [
		{
			method: "GET",
			path: "/api/code_cep_coordinates?limit=5",
			href: "/api/code_cep_coordinates?limit=5",
			description: "Primeiros 5 CEPs.",
		},
		{
			method: "GET",
			path: "/api/code_cep_coordinates/01310",
			href: "/api/code_cep_coordinates/01310",
			description: "Coordenadas do CEP 01310.",
		},
		{
			method: "GET",
			path: "/api/code_cep_coordinates?POSTCODE=00000",
			href: "/api/code_cep_coordinates?POSTCODE=00000",
			description: "Filtrar por POSTCODE exato.",
		},
	],
};

export const cepDocPage = generateDocPage(cepDoc);
