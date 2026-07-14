import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Dataset } from "../../lib/types.js";
import { registerGetProduct } from "./api/get-product.js";
import { registerListProducts } from "./api/list-products.js";
import { ProductsPage } from "./page.js";
import supercategoriesMap from "./supercategories.json" with { type: "json" };

interface SupercategoryShortcut {
	name: string;
	categories: string[];
}

function supercategoryShortcuts(): SupercategoryShortcut[] {
	return Object.entries(supercategoriesMap).map(([name, categories]) => ({
		name,
		categories: [...categories],
	}));
}

export function registerProducts(
	app: OpenAPIHono,
	datasets: Map<string, Dataset>,
): void {
	app.get("/products", (c) => {
		const products = datasets.get("products");

		return c.html(
			ProductsPage({
				count: products?.records.length ?? 0,
				supercategories: supercategoryShortcuts(),
			}),
		);
	});

	registerListProducts(app, datasets);
	registerGetProduct(app, datasets);
}
