import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Dataset } from "../../lib/types.js";
import { registerGetProduct } from "./api/get-product.js";
import { registerListProducts } from "./api/list-products.js";
import { ProductsPage } from "./docs.js";
import supercategoriesMap from "./supercategories.json" with { type: "json" };

const supercategories = Object.entries(supercategoriesMap).map(
	([name, categories]) => ({
		name,
		categories: [...categories],
	}),
);

export function registerProducts(
	app: OpenAPIHono,
	datasets: Map<string, Dataset>,
): void {
	app.get("/products", (c) =>
		c.html(
			ProductsPage({
				supercategories,
			}),
		),
	);

	registerListProducts(app, datasets);
	registerGetProduct(app, datasets);
}
