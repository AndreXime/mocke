import type { z } from "@hono/zod-openapi";
import { paginate } from "../../database/runtime/query.js";
import { getDatasetMeta } from "../../database/runtime/store.js";
import { CepCoordinateSchema } from "../cep/api/list-ceps.js";
import { MovieSchema } from "../movies/api/list-movies.js";
import { NewsArticleSchema } from "../news/api/list-news.js";
import { ProductSchema } from "../products/api/list-products.js";
import { UserSchema } from "../users/api/list-users.js";

export const datasetSchemas = {
	products: ProductSchema,
	code_cep_coordinates: CepCoordinateSchema,
	news: NewsArticleSchema,
	movies: MovieSchema,
	users: UserSchema,
} as const;

export type DatasetName = keyof typeof datasetSchemas;

export type DatasetRecords = {
	[K in DatasetName]: z.infer<(typeof datasetSchemas)[K]>;
};

const SAMPLE_LIMIT = 100;

function schemaFieldNames(schema: (typeof datasetSchemas)[DatasetName]): string[] {
	return Object.keys(schema.shape);
}

export function assertDatasetContracts(): void {
	const errors: string[] = [];

	for (const name of Object.keys(datasetSchemas) as DatasetName[]) {
		const schema = datasetSchemas[name];
		const meta = getDatasetMeta(name);
		if (!meta) {
			errors.push(`"${name}" prometido no contrato, mas ausente no SQLite`);
			continue;
		}

		const missingFields = schemaFieldNames(schema).filter(
			(field) => !meta.fields.includes(field),
		);
		if (missingFields.length > 0) {
			errors.push(
				`"${name}": schema exige campos ausentes nos dados: ${missingFields.join(", ")}`,
			);
		}

		const page = paginate(
			meta,
			new URLSearchParams({ limit: String(SAMPLE_LIMIT) }),
		);
		if (page.data.length === 0) continue;

		for (let index = 0; index < page.data.length; index += 1) {
			const result = schema.safeParse(page.data[index]);
			if (result.success) continue;

			const details = result.error.issues
				.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
				.join("; ");
			errors.push(`"${name}" amostra[${index}]: ${details}`);
			break;
		}
	}

	if (errors.length === 0) return;

	throw new Error(`Contratos de dataset invalidos:\n- ${errors.join("\n- ")}`);
}
