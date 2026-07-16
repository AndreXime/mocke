import { generateDocPage } from "../shared/DocsPage.js";

export const usersDocsPage = generateDocPage({
	kicker: "Pessoas",
	title: "Users",
	description:
		"Usuarios fake com nome, contato, endereco e foto. Ideal para listagens de perfil, avatares e filtros por genero ou pais.",
	fields: [
		{ name: "id", type: "string", note: "chave primaria" },
		{ name: "first_name", type: "string" },
		{ name: "last_name", type: "string" },
		{ name: "email", type: "string" },
		{ name: "username", type: "string" },
		{ name: "gender", type: "string", note: "male | female" },
		{ name: "age", type: "string" },
		{ name: "birth_date", type: "string", note: "YYYY-MM-DD" },
		{ name: "phone", type: "string" },
		{ name: "cell", type: "string" },
		{ name: "street", type: "string" },
		{ name: "city", type: "string" },
		{ name: "state", type: "string" },
		{ name: "country", type: "string" },
		{ name: "postcode", type: "string" },
		{ name: "latitude", type: "string" },
		{ name: "longitude", type: "string" },
		{ name: "nationality", type: "string", note: "ex.: US, GB, BR" },
		{ name: "picture", type: "string", note: "URL da foto" },
		{ name: "registered_at", type: "string", note: "YYYY-MM-DD" },
	],
	routes: [
		{
			method: "GET",
			path: "/api/users",
			href: "/api/users?limit=5",
			description:
				"Lista paginada. Query: page, limit e qualquer campo do usuario.",
		},
		{
			method: "GET",
			path: "/api/users/{id}",
			href: "/api/users/1",
			description: "Busca um usuario pelo id.",
		},
	],
	examples: [
		{
			method: "GET",
			path: "/api/users?limit=5",
			href: "/api/users?limit=5",
			description: "Primeiros 5 usuarios.",
		},
		{
			method: "GET",
			path: "/api/users/1",
			href: "/api/users/1",
			description: "Usuario com id 1.",
		},
		{
			method: "GET",
			path: "/api/users?gender=female&limit=5",
			href: "/api/users?gender=female&limit=5",
			description: "Filtrar por gender.",
		},
		{
			method: "GET",
			path: "/api/users?nationality=US&limit=5",
			href: "/api/users?nationality=US&limit=5",
			description: "Filtrar por nationality.",
		},
	],
});
