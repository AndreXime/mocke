import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import type { DataRecord, Dataset, FieldValue, Scalar } from "../lib/types.js";

const DATA_DIR = join(process.cwd(), "data");

const ID_CANDIDATES = [
	"id",
	"ID",
	"_id",
	"uuid",
	"UUID",
	"POSTCODE",
	"postcode",
	"code",
	"CODE",
	"slug",
	"name",
] as const;

function isScalar(value: unknown): value is Scalar {
	return (
		value === null ||
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	);
}

function toFieldValue(value: unknown): FieldValue {
	if (isScalar(value)) return value;
	if (Array.isArray(value)) {
		return value.map((item) => (isScalar(item) ? item : JSON.stringify(item)));
	}
	if (value && typeof value === "object") {
		const out: Record<string, Scalar | Scalar[]> = {};
		for (const [key, nested] of Object.entries(value)) {
			if (isScalar(nested)) out[key] = nested;
			else if (Array.isArray(nested)) {
				out[key] = nested.map((item) =>
					isScalar(item) ? item : JSON.stringify(item),
				);
			} else {
				out[key] = JSON.stringify(nested);
			}
		}
		return out;
	}
	return String(value);
}

function detectIdField(fields: string[]): string {
	for (const candidate of ID_CANDIDATES) {
		if (fields.includes(candidate)) return candidate;
	}
	return fields[0] ?? "id";
}

function recordsFromJson(parsed: unknown): DataRecord[] {
	if (Array.isArray(parsed)) {
		return parsed.map((item, index) => {
			if (item && typeof item === "object" && !Array.isArray(item)) {
				const record: DataRecord = {};
				for (const [key, value] of Object.entries(item)) {
					record[key] = toFieldValue(value);
				}
				if (!("id" in record)) record.id = String(index);
				return record;
			}
			return { id: String(index), value: toFieldValue(item) };
		});
	}

	if (parsed && typeof parsed === "object") {
		return Object.entries(parsed).map(([key, value]) => {
			if (Array.isArray(value)) {
				return {
					name: key,
					categories: value.map((item) =>
						isScalar(item) ? item : JSON.stringify(item),
					),
				};
			}
			if (value && typeof value === "object") {
				const record: DataRecord = { name: key };
				for (const [nestedKey, nestedValue] of Object.entries(value)) {
					record[nestedKey] = toFieldValue(nestedValue);
				}
				return record;
			}
			return { name: key, value: toFieldValue(value) };
		});
	}

	return [{ id: "0", value: toFieldValue(parsed) }];
}

async function loadCsv(filePath: string): Promise<DataRecord[]> {
	const content = await Bun.file(filePath).text();
	const rows = parse(content, {
		columns: true,
		skip_empty_lines: true,
		relax_column_count: true,
	}) as Record<string, string>[];

	return rows.map((row) => {
		const record: DataRecord = {};
		for (const [key, value] of Object.entries(row)) {
			record[key] = value ?? "";
		}
		return record;
	});
}

async function loadJson(filePath: string): Promise<DataRecord[]> {
	const content = await Bun.file(filePath).text();
	const parsed: unknown = JSON.parse(content);
	return recordsFromJson(parsed);
}

function datasetNameFromFile(fileName: string): string {
	return fileName.replace(/\.(csv|json)$/i, "");
}

async function loadDataset(fileName: string): Promise<[string, Dataset]> {
	const filePath = join(DATA_DIR, fileName);
	const format = fileName.toLowerCase().endsWith(".csv") ? "csv" : "json";
	const records =
		format === "csv" ? await loadCsv(filePath) : await loadJson(filePath);
	const fieldSet = new Set<string>();
	for (const record of records) {
		for (const key of Object.keys(record)) fieldSet.add(key);
	}
	const fields = [...fieldSet];
	const name = datasetNameFromFile(fileName);

	return [
		name,
		{
			name,
			source: fileName,
			format,
			idField: detectIdField(fields),
			fields,
			records,
		},
	];
}

async function loadDatasets(): Promise<Map<string, Dataset>> {
	const datasets = new Map<string, Dataset>();

	let files: string[];
	try {
		files = await readdir(DATA_DIR);
	} catch {
		return datasets;
	}

	const dataFiles = files
		.filter((name) => /\.(csv|json)$/i.test(name))
		.sort((a, b) => a.localeCompare(b));

	const loaded = await Promise.all(dataFiles.map(loadDataset));
	for (const [name, dataset] of loaded) {
		datasets.set(name, dataset);
	}

	return datasets;
}

export const datasets = await loadDatasets();
