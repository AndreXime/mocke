import { parse } from "csv-parse/sync";
import type { DataRecord, FieldValue, Scalar } from "../../lib/types.js";

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

function valueIsObject(item: unknown): item is Record<string, unknown> {
	return Boolean(item) && typeof item === "object" && !Array.isArray(item);
}

function recordsFromJson(parsed: unknown): DataRecord[] {
	if (Array.isArray(parsed)) {
		return parsed.map((item, index) => {
			if (valueIsObject(item)) {
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

export async function loadCsv(filePath: string): Promise<DataRecord[]> {
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

export async function loadJson(filePath: string): Promise<DataRecord[]> {
	const content = await Bun.file(filePath).text();
	const parsed: unknown = JSON.parse(content);
	return recordsFromJson(parsed);
}

export function fileFormat(fileName: string): "csv" | "json" {
	return fileName.toLowerCase().endsWith(".csv") ? "csv" : "json";
}

export async function loadDataFile(filePath: string, format: "csv" | "json") {
	return format === "csv" ? loadCsv(filePath) : loadJson(filePath);
}

export function cellToText(value: FieldValue | undefined): string {
	if (value === undefined || value === null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return JSON.stringify(value);
}
