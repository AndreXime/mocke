import { z } from "@hono/zod-openapi";
import { findById, paginate } from "../../database/runtime/query.js";
import { getDatasetMeta } from "../../database/runtime/store.js";
import { HTTPError } from "../../lib/errors.js";
import type { DataRecord, PageResult } from "../../lib/types.js";

export const ErrorSchema = z
	.object({
		error: z.string(),
	})
	.openapi("Error");

export function pageResultSchema<T extends z.ZodType>(
	itemSchema: T,
	name: string,
) {
	return z
		.object({
			dataset: z.string(),
			page: z.number().int(),
			limit: z.number().int(),
			total: z.number().int(),
			totalPages: z.number().int(),
			data: z.array(itemSchema),
		})
		.openapi(name);
}

export function listPage(name: string, url: string): PageResult {
	const dataset = getDatasetMeta(name);
	if (!dataset) {
		throw new HTTPError(404, `Dataset ${name} indisponivel`);
	}
	return paginate(dataset, new URL(url).searchParams);
}

export function getRecord(name: string, id: string): DataRecord {
	const dataset = getDatasetMeta(name);
	if (!dataset) {
		throw new HTTPError(404, `Dataset ${name} indisponivel`);
	}
	const record = findById(dataset, id);
	if (!record) {
		throw new HTTPError(
			404,
			`Item com id ${id} nao encontrado no dataset ${name}`,
		);
	}
	return record;
}
