import type { DataRecord, Dataset, PageResult } from "../../lib/types.js";
import { quoteIdent } from "../init/sqlite.js";
import { getDb } from "./store.js";

const RESERVED_PARAMS = new Set(["page", "limit"]);

function splitFilterValues(raw: string): string[] {
	return raw
		.split(",")
		.map((part) => part.trim())
		.filter((part) => part.length > 0);
}

function rowToRecord(
	row: Record<string, string | null>,
	dataset: Dataset,
): DataRecord {
	const record: DataRecord = {};
	for (const field of dataset.fields) {
		const column = dataset.columnMap.get(field) ?? field;
		record[field] = row[column] ?? "";
	}
	return record;
}

function buildFilters(
	params: URLSearchParams,
	dataset: Dataset,
): { clause: string; values: string[] } {
	const fieldSet = new Set(dataset.fields);
	const parts: string[] = [];
	const values: string[] = [];

	for (const [key, value] of params.entries()) {
		if (RESERVED_PARAMS.has(key)) continue;
		if (!fieldSet.has(key)) continue;
		const filterValues = splitFilterValues(value);
		if (filterValues.length === 0) continue;

		const column = dataset.columnMap.get(key) ?? key;
		const col = quoteIdent(column);
		// Exact match or membership in a comma-separated list (e.g. genres=Action).
		const valueClauses = filterValues.map((filterValue) => {
			values.push(filterValue, filterValue);
			return `(${col} = ? OR (',' || REPLACE(${col}, ', ', ',') || ',') LIKE '%,' || ? || ',%')`;
		});
		parts.push(`(${valueClauses.join(" OR ")})`);
	}

	if (parts.length === 0) return { clause: "", values: [] };
	return { clause: `WHERE ${parts.join(" AND ")}`, values };
}

export function paginate(
	dataset: Dataset,
	params: URLSearchParams,
): PageResult {
	const page = Math.max(1, Number(params.get("page") || 1) || 1);
	const limit = Math.min(
		100,
		Math.max(1, Number(params.get("limit") || 20) || 20),
	);
	const { clause, values } = buildFilters(params, dataset);
	const table = quoteIdent(dataset.tableName);
	const db = getDb();

	const countRow = db
		.query(`SELECT COUNT(*) AS total FROM ${table} ${clause}`)
		.get(...values) as { total: number };
	const total = Number(countRow.total);
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const start = (page - 1) * limit;

	const rows = db
		.query(`SELECT * FROM ${table} ${clause} LIMIT ? OFFSET ?`)
		.all(...values, limit, start) as Array<Record<string, string | null>>;

	return {
		dataset: dataset.name,
		page,
		limit,
		total,
		totalPages,
		data: rows.map((row) => rowToRecord(row, dataset)),
	};
}

export function findById(dataset: Dataset, id: string): DataRecord | undefined {
	const idColumn = dataset.columnMap.get(dataset.idField) ?? dataset.idField;
	const db = getDb();
	const row = db
		.query(
			`SELECT * FROM ${quoteIdent(dataset.tableName)} WHERE ${quoteIdent(idColumn)} = ? LIMIT 1`,
		)
		.get(id) as Record<string, string | null> | null;

	if (!row) return undefined;
	return rowToRecord(row, dataset);
}
