import { type DocProps, generateDocPage } from "../shared/DocsPage.js";

export const authDoc: DocProps = {
	href: "/auth",
	kicker: "Seguranca",
	title: "Auth",
	description:
		"Login e /me com Bearer falso para prototipar telas autenticadas. Sem sessao real.",
	fields: [
		{ name: "token", type: "string", note: "retornado no login" },
		{ name: "tokenType", type: "string", note: "sempre Bearer" },
		{ name: "id", type: "string", note: "user mock em /me" },
		{ name: "name", type: "string" },
		{ name: "email", type: "string" },
	],
	routes: [
		{
			method: "POST",
			path: "/api/auth/login",
			href: "/api/auth/login",
			description: "Qualquer body. Retorna mock-token.",
		},
		{
			method: "GET",
			path: "/api/auth/me",
			href: "/api/auth/me",
			description:
				"Authorization: Bearer mock-token → 200. Sem header → 401. Bearer forbidden → 403.",
		},
	],
	examples: [
		{
			method: "POST",
			path: "/api/auth/login",
			href: "/api/auth/login",
			description: "Obter token mock.",
		},
		{
			method: "GET",
			path: "/api/auth/me",
			href: "/api/auth/me",
			description: "Chamar com header Authorization: Bearer mock-token.",
		},
	],
};

export const authDocPage = generateDocPage(authDoc);
