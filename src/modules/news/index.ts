import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerMockMutations } from "../shared/mock-mutations.js";
import { registerGetNews } from "./api/get-news.js";
import { registerListNews } from "./api/list-news.js";
import { newsDocPage } from "./docs.js";

export function registerNews(app: OpenAPIHono): void {
	app.get("/news", (c) => c.html(newsDocPage));

	registerListNews(app);
	registerGetNews(app);
	registerMockMutations(app, { name: "news", tag: "News" });
}
