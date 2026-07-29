import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerMockMutations } from "../shared/mock-mutations.js";
import { registerGetProduct } from "./api/get-product.js";
import { registerListProducts } from "./api/list-products.js";
import { productsDocPage } from "./docs.js";

export function registerProducts(app: OpenAPIHono): void {
	app.get("/products", (c) => c.html(productsDocPage));

	registerListProducts(app);
	registerGetProduct(app);
	registerMockMutations(app, { name: "products", tag: "Products" });
}
