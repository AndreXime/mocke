import type { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HTTPError extends Error {
	readonly status: ContentfulStatusCode;

	constructor(status: ContentfulStatusCode, message: string) {
		super(message);
		this.name = "HTTPError";
		this.status = status;
	}
}

export function setupErrorHandler(app: OpenAPIHono): void {
	app.onError((err, c) => {
		if (err instanceof HTTPError) {
			return c.json({ error: err.message }, err.status);
		}
		if (err instanceof HTTPException) {
			return err.getResponse();
		}
		console.error(err);
		return c.json({ error: "Erro interno" }, 500);
	});
}
