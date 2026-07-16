import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerGetUser } from "./api/get-user.js";
import { registerListUsers } from "./api/list-users.js";
import { usersDocsPage } from "./docs.js";

export function registerUsers(app: OpenAPIHono): void {
	app.get("/users", (c) => c.html(usersDocsPage));

	registerListUsers(app);
	registerGetUser(app);
}
