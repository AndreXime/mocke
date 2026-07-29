import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { HTTPError } from "../../middlewares/errors.js";
import { ErrorSchema, OkSchema } from "./api.js";

interface MockMutationsOptions {
	name: string;
	tag: string;
}

function shouldFail(url: string): boolean {
	const raw = new URL(url).searchParams.get("fail");
	if (raw === null) return false;
	const p = Number(raw);
	if (!Number.isFinite(p) || p < 0 || p > 1) return false;
	return Math.random() < p;
}

function maybeFail(url: string): void {
	if (shouldFail(url)) {
		throw new HTTPError(500, "Mock failure");
	}
}

export function registerMockMutations(
	app: OpenAPIHono,
	{ name, tag }: MockMutationsOptions,
): void {
	const base = `/api/${name}`;
	const byId = `${base}/{id}`;

	const failQuery = z
		.object({
			fail: z.string().optional().openapi({
				example: "0.3",
				description: "Probabilidade 0..1 de responder 500.",
			}),
		})
		.passthrough();

	const idParam = z.object({
		id: z.string().openapi({ param: { name: "id", in: "path" } }),
	});

	const create = createRoute({
		method: "post",
		path: base,
		tags: [tag],
		summary: `Mock create ${name}`,
		description:
			"Nao persiste. Retorna 201 { ok: true }. Use fail=0..1 para falha probabilistica.",
		request: { query: failQuery },
		responses: {
			201: {
				description: "Criado (fake)",
				content: { "application/json": { schema: OkSchema } },
			},
			500: {
				description: "Mock failure",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
	});

	const put = createRoute({
		method: "put",
		path: byId,
		tags: [tag],
		summary: `Mock replace ${name}`,
		description: "Nao persiste. Retorna 200 { ok: true }.",
		request: { params: idParam, query: failQuery },
		responses: {
			200: {
				description: "Atualizado (fake)",
				content: { "application/json": { schema: OkSchema } },
			},
			500: {
				description: "Mock failure",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
	});

	const patch = createRoute({
		method: "patch",
		path: byId,
		tags: [tag],
		summary: `Mock patch ${name}`,
		description: "Nao persiste. Retorna 200 { ok: true }.",
		request: { params: idParam, query: failQuery },
		responses: {
			200: {
				description: "Atualizado (fake)",
				content: { "application/json": { schema: OkSchema } },
			},
			500: {
				description: "Mock failure",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
	});

	const del = createRoute({
		method: "delete",
		path: byId,
		tags: [tag],
		summary: `Mock delete ${name}`,
		description: "Nao persiste. Retorna 204.",
		request: { params: idParam, query: failQuery },
		responses: {
			204: { description: "Removido (fake)" },
			500: {
				description: "Mock failure",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
	});

	app.openapi(create, (c) => {
		maybeFail(c.req.url);
		return c.json({ ok: true as const }, 201);
	});
	app.openapi(put, (c) => {
		maybeFail(c.req.url);
		return c.json({ ok: true as const }, 200);
	});
	app.openapi(patch, (c) => {
		maybeFail(c.req.url);
		return c.json({ ok: true as const }, 200);
	});
	app.openapi(del, (c) => {
		maybeFail(c.req.url);
		return c.body(null, 204);
	});
}
