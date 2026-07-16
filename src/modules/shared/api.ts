import { z } from "@hono/zod-openapi";
import { findById, paginate } from "../../database/runtime/query.js";
import { getDatasetMeta } from "../../database/runtime/store.js";
import type { PageResult } from "../../lib/types.js";
import { HTTPError } from "../../middlewares/errors.js";
import type { DatasetName, DatasetRecords } from "./contracts.js";

export type { DatasetName, DatasetRecords } from "./contracts.js";

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

export function listPage<N extends DatasetName>(
	name: N,
	url: string,
): PageResult<DatasetRecords[N]> {
	const dataset = getDatasetMeta(name);
	if (!dataset) {
		throw new HTTPError(404, `Dataset ${name} indisponivel`);
	}
	return paginate(dataset, new URL(url).searchParams) as PageResult<
		DatasetRecords[N]
	>;
}

export function getRecord<N extends DatasetName>(
	name: N,
	id: string,
): DatasetRecords[N] {
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
	return record as DatasetRecords[N];
}
