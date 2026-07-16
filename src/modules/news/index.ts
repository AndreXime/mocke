import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerGetNews } from "./api/get-news.js";
import { registerListNews } from "./api/list-news.js";
import { newsDocPage } from "./docs.js";

export function registerNews(app: OpenAPIHono): void {
	app.get("/news", (c) => c.html(newsDocPage));

	registerListNews(app);
	registerGetNews(app);
}
