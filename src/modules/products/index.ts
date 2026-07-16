import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerGetProduct } from "./api/get-product.js";
import { registerListProducts } from "./api/list-products.js";
import { productsDocPage } from "./docs.js";

export function registerProducts(app: OpenAPIHono): void {
	app.get("/products", (c) => c.html(productsDocPage));

	registerListProducts(app);
	registerGetProduct(app);
}
