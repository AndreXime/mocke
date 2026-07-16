import type { OpenAPIHono } from "@hono/zod-openapi";
import { HomePage } from "./page.js";

export function registerHome(app: OpenAPIHono): void {
	app.get("/", (c) => c.html(HomePage));
}
