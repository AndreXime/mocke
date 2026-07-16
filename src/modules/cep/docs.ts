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
			description: "Lista paginada. Query: page, limit, POSTCODE, LON, LAT.",
		},
		{
			method: "GET",
			path: "/api/code_cep_coordinates/{id}",
			href: "/api/code_cep_coordinates/01310",
			description: "Busca um CEP pelo POSTCODE.",
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
