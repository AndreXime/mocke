import { Layout } from "../shared/Layout.js";
import { ResourcePage } from "../shared/ResourcePage.js";

interface SupercategoryShortcut {
	name: string;
	categories: string[];
}

interface ProductsPageProps {
	count: number;
	supercategories: SupercategoryShortcut[];
}

const productFields = [
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
];

function productsQueryHref(categories: string[]): string {
	const params = new URLSearchParams();
	params.set("category", categories.join(","));
	params.set("limit", "5");
	return `/api/products?${params.toString()}`;
}

function SupercategoryShortcutsSection({
	supercategories,
}: {
	supercategories: SupercategoryShortcut[];
}) {
	return (
		<section class="doc-block supercategory-shortcuts">
			<h2 class="section-title">Atalhos por supercategoria</h2>
			<p class="lede">
				Agrupamentos so para a UI: ao clicar, monta um GET /api/products com
				todas as categories filhas juntas (OR via virgula).
			</p>
			<ul class="shortcut-list">
				{supercategories.map((item) => {
					const href = productsQueryHref(item.categories);
					return (
						<li>
							<a href={href}>
								<strong>{item.name}</strong>
								<span>
									{item.categories.length.toLocaleString("pt-BR")} categories
								</span>
							</a>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

export function ProductsPage({ count, supercategories }: ProductsPageProps) {
	const modaFeminina = supercategories.find(
		(item) => item.name === "Moda Feminina",
	);
	const multiCategoryExample = modaFeminina
		? {
				method: "GET",
				path: `/api/products?category=${encodeURIComponent(modaFeminina.categories.join(","))}&limit=5`,
				href: productsQueryHref(modaFeminina.categories),
				description:
					"Varias categories de uma vez (OR), montado a partir da supercategoria Moda Feminina.",
			}
		: null;

	return (
		<Layout title="Products · Mockê">
			<ResourcePage
				variant="products"
				kicker="E-commerce"
				title="Products"
				description="Catalogo de produtos de e-commerce. Use para listagens, PDPs, filtros de categoria e mocks de estoque."
				countLabel={`${count.toLocaleString("pt-BR")} registros`}
				idField="id"
				fields={productFields}
				routes={[
					{
						method: "GET",
						path: "/api/products",
						href: "/api/products?limit=5",
						description:
							"Lista paginada. Query: page, limit e qualquer campo. category aceita valores separados por virgula (OR).",
					},
					{
						method: "GET",
						path: "/api/products/{id}",
						href: "/api/products/B091F3YVH6",
						description: "Busca um produto pelo id.",
					},
				]}
				examples={[
					{
						method: "GET",
						path: "/api/products?limit=5",
						href: "/api/products?limit=5",
						description: "Primeiros 5 produtos.",
					},
					{
						method: "GET",
						path: "/api/products?category=Abrasive%20%26%20Finishing%20Products&limit=5",
						href: "/api/products?category=Abrasive%20%26%20Finishing%20Products&limit=5",
						description: "Filtrar por uma category.",
					},
					...(multiCategoryExample ? [multiCategoryExample] : []),
					{
						method: "GET",
						path: "/api/products?inStock=True&limit=5",
						href: "/api/products?inStock=True&limit=5",
						description: "Apenas itens em estoque.",
					},
				]}
				extraTabs={
					supercategories.length > 0
						? [
								{
									id: "shortcuts",
									label: "Supercategorias",
									content: (
										<SupercategoryShortcutsSection
											supercategories={supercategories}
										/>
									),
								},
							]
						: undefined
				}
			/>
		</Layout>
	);
}
