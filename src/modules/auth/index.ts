import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerLogin } from "./api/login.js";
import { registerMe } from "./api/me.js";
import { authDocPage } from "./docs.js";

export function registerAuth(app: OpenAPIHono): void {
	app.get("/auth", (c) => c.html(authDocPage));
	registerLogin(app);
	registerMe(app);
}
