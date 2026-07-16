import { z } from "@hono/zod-openapi";
import { findById, paginate } from "../../database/runtime/query.js";
import { getDatasetMeta } from "../../database/runtime/store.js";
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

/** `null` se o dataset nao existir. */
export function listPage(name: string, url: string): PageResult | null {
	const dataset = getDatasetMeta(name);
	if (!dataset) return null;
	return paginate(dataset, new URL(url).searchParams);
}

/**
 * `null` se o dataset nao existir.
 * `undefined` se o registro nao for encontrado.
 */
export function getRecord(
	name: string,
	id: string,
): DataRecord | null | undefined {
	const dataset = getDatasetMeta(name);
	if (!dataset) return null;
	return findById(dataset, id);
}
