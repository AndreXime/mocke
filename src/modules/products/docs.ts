import { type DocProps, generateDocPage } from "../shared/DocsPage.js";
import supercategoriesMap from "./supercategories.json" with { type: "json" };

const supercategories = Object.entries(supercategoriesMap).map(
	([name, categories]) => ({
		name,
		categories: [...categories],
	}),
);

function productsQueryHref(categories: string[]): string {
	const params = new URLSearchParams();
	params.set("category", categories.join(","));
	params.set("limit", "5");
	return `/api/products?${params.toString()}`;
}

export const productsDoc: DocProps = {
	href: "/products",
	kicker: "E-commerce",
	title: "Products",
	description:
		"Catalogo de produtos de e-commerce. Use para listagens, PDPs, filtros de categoria e mocks de estoque.",
	fields: [
		{ name: "id", type: "string", note: "chave primaria" },
		{ name: "source", type: "string", note: "ex.: amazon" },
		{ name: "title", type: "string" },
		{ name: "description", type: "string" },
		{ name: "brand", type: "string" },
		{
			name: "category",
			type: "string",
			note: "aceita varios valores separados por virgula (OR)",
		},
		{ name: "price", type: "string" },
		{ name: "listPrice", type: "string" },
		{ name: "packSize", type: "string" },
		{ name: "images", type: "string", note: "URLs separadas por |" },
		{ name: "url", type: "string" },
		{ name: "stars", type: "string" },
		{ name: "reviews", type: "string" },
		{ name: "inStock", type: "string", note: "True | False" },
		{ name: "isBestSeller", type: "string", note: "True | False" },
		{ name: "boughtInLastMonth", type: "string" },
	],
	routes: [
		{
			method: "GET",
			path: "/api/products",
			href: "/api/products?limit=5",
			description:
				"Lista paginada. Query: page, limit, q/search, searchFields, sort, order, fields e qualquer campo. category aceita valores separados por virgula (OR).",
		},
		{
			method: "GET",
			path: "/api/products/{id}",
			href: "/api/products/B091F3YVH6",
			description: "Busca um produto pelo id. Query opcional: fields.",
		},
		{
			method: "POST",
			path: "/api/products",
			href: "/api/products",
			description:
				"Mock create: 201 { ok: true }. Nao persiste. Query fail=0..1 para 500 probabilistico.",
		},
		{
			method: "PUT",
			path: "/api/products/{id}",
			href: "/api/products/B091F3YVH6",
			description: "Mock replace: 200 { ok: true }. Nao persiste.",
		},
		{
			method: "PATCH",
			path: "/api/products/{id}",
			href: "/api/products/B091F3YVH6",
			description: "Mock patch: 200 { ok: true }. Nao persiste.",
		},
		{
			method: "DELETE",
			path: "/api/products/{id}",
			href: "/api/products/B091F3YVH6",
			description: "Mock delete: 204. Nao persiste.",
		},
	],
	examples: [
		{
			method: "GET",
			path: "/api/products?limit=5",
			href: "/api/products?limit=5",
			description: "Primeiros 5 produtos.",
		},
		{
			method: "GET",
			path: "/api/products?q=shoes&searchFields=title&limit=5",
			href: "/api/products?q=shoes&searchFields=title&limit=5",
			description: "Busca textual em title.",
		},
		{
			method: "GET",
			path: "/api/products?sort=price&order=desc&fields=id,title,price&limit=5",
			href: "/api/products?sort=price&order=desc&fields=id,title,price&limit=5",
			description: "Ordenar por price e projetar campos.",
		},
		{
			method: "GET",
			path: "/api/products?category=Abrasive%20%26%20Finishing%20Products&limit=5",
			href: "/api/products?category=Abrasive%20%26%20Finishing%20Products&limit=5",
			description: "Filtrar por uma category.",
		},
		{
			method: "GET",
			path: `/api/products?category=${encodeURIComponent(supercategories[0].categories.join(","))}&limit=5`,
			href: productsQueryHref(supercategories[0].categories),
			description: `Varias categories de uma vez (OR), montado a partir da supercategoria ${supercategories[0].name}.`,
		},
		{
			method: "GET",
			path: "/api/products?inStock=True&limit=5",
			href: "/api/products?inStock=True&limit=5",
			description: "Apenas itens em estoque.",
		},
	],
	extraTabs: [
		{
			id: "shortcuts",
			label: "Supercategorias",
			title: "Atalhos por supercategoria",
			description:
				"Agrupamentos so para a UI: ao clicar, monta um GET /api/products com todas as categories filhas juntas (OR via virgula).",
			items: supercategories.map((item) => ({
				href: productsQueryHref(item.categories),
				label: item.name,
				value: `${item.categories.length.toLocaleString("pt-BR")} categories`,
			})),
		},
	],
};

export const productsDocPage = generateDocPage(productsDoc);
