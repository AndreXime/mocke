import { z } from "@hono/zod-openapi";
import { findById, paginate } from "../../datasets/query.js";
import type { Dataset } from "../../lib/types.js";
import { datasets } from "../../datasets/load.js";

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

export function getDataset(name: string): Dataset | null {
	return datasets.get(name) ?? null;
}

export function listPage(dataset: Dataset, url: string) {
	return paginate(dataset, new URL(url).searchParams);
}

export function getRecord(dataset: Dataset, id: string) {
	return findById(dataset, id);
}
