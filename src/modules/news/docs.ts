import { type DocProps, generateDocPage } from "../shared/DocsPage.js";

export const newsDoc: DocProps = {
	href: "/news",
	kicker: "Conteúdo",
	title: "News",
	description:
		"Artigos de noticia em ingles com titulo, texto, assunto e data. Ideal para feeds, listagens e filtros por subject.",
	fields: [
		{ name: "id", type: "string", note: "chave primaria" },
		{ name: "title", type: "string" },
		{ name: "text", type: "string", note: "corpo da noticia" },
		{
			name: "subject",
			type: "string",
			note: "aceita varios valores separados por virgula (OR)",
		},
		{ name: "date", type: "string", note: "ex.: December 31, 2017" },
	],
	routes: [
		{
			method: "GET",
			path: "/api/news",
			href: "/api/news?limit=5",
			description:
				"Lista paginada. Query: page, limit, q/search, searchFields, sort, order, fields, title, text, subject, date.",
		},
		{
			method: "GET",
			path: "/api/news/{id}",
			href: "/api/news/1",
			description: "Busca uma noticia pelo id. Query opcional: fields.",
		},
		{
			method: "POST",
			path: "/api/news",
			href: "/api/news",
			description:
				"Mock create: 201 { ok: true }. Nao persiste. Query fail=0..1 para 500 probabilistico.",
		},
		{
			method: "PUT",
			path: "/api/news/{id}",
			href: "/api/news/1",
			description: "Mock replace: 200 { ok: true }. Nao persiste.",
		},
		{
			method: "PATCH",
			path: "/api/news/{id}",
			href: "/api/news/1",
			description: "Mock patch: 200 { ok: true }. Nao persiste.",
		},
		{
			method: "DELETE",
			path: "/api/news/{id}",
			href: "/api/news/1",
			description: "Mock delete: 204. Nao persiste.",
		},
	],
	examples: [
		{
			method: "GET",
			path: "/api/news?limit=5",
			href: "/api/news?limit=5",
			description: "Primeiras 5 noticias.",
		},
		{
			method: "GET",
			path: "/api/news/1",
			href: "/api/news/1",
			description: "Noticia com id 1.",
		},
		{
			method: "GET",
			path: "/api/news?subject=politicsNews&limit=5",
			href: "/api/news?subject=politicsNews&limit=5",
			description: "Filtrar por subject.",
		},
	],
};

export const newsDocPage = generateDocPage(newsDoc);
