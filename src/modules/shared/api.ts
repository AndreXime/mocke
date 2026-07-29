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

export const OkSchema = z
	.object({
		ok: z.literal(true),
	})
	.openapi("Ok");

export const listQueryExtrasSchema = z
	.object({
		page: z.string().optional().openapi({ example: "1" }),
		limit: z.string().optional().openapi({ example: "20" }),
		q: z.string().optional().openapi({
			example: "shoes",
			description: "Busca textual (LIKE). Tem prioridade sobre search.",
		}),
		search: z.string().optional().openapi({
			description: "Alias de q.",
		}),
		searchFields: z.string().optional().openapi({
			example: "title,description",
			description: "Campos CSV para restringir a busca.",
		}),
		sort: z.string().optional().openapi({ example: "price" }),
		order: z.string().optional().openapi({
			example: "desc",
			description: "asc (default) ou desc.",
		}),
		fields: z.string().optional().openapi({
			example: "id,title,price",
			description: "Projecao CSV de campos na resposta.",
		}),
	})
	.passthrough();

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
	url?: string,
): DatasetRecords[N] {
	const dataset = getDatasetMeta(name);
	if (!dataset) {
		throw new HTTPError(404, `Dataset ${name} indisponivel`);
	}
	const params = url ? new URL(url).searchParams : new URLSearchParams();
	const record = findById(dataset, id, params);
	if (!record) {
		throw new HTTPError(
			404,
			`Item com id ${id} nao encontrado no dataset ${name}`,
		);
	}
	return record as DatasetRecords[N];
}
