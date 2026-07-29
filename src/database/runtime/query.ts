import type { Statement } from "bun:sqlite";
import type { DataRecord, Dataset, PageResult } from "../../lib/types.js";
import { quoteIdent } from "../init/sqlite.js";
import { getDb } from "./store.js";

const RESERVED_PARAMS = new Set([
	"page",
	"limit",
	"q",
	"search",
	"searchFields",
	"sort",
	"order",
	"fields",
]);
const prepared = new Map<string, Statement>();

function prepare(sql: string): Statement {
	let statement = prepared.get(sql);
	if (!statement) {
		statement = getDb().query(sql);
		prepared.set(sql, statement);
	}
	return statement;
}

function splitCsv(raw: string): string[] {
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

export function projectFields(
	record: DataRecord,
	params: URLSearchParams,
	dataset: Dataset,
): DataRecord {
	const raw = params.get("fields");
	if (!raw) return record;
	const fieldSet = new Set(dataset.fields);
	const requested = splitCsv(raw).filter((name) => fieldSet.has(name));
	if (requested.length === 0) return record;
	const projected: DataRecord = {};
	for (const name of requested) {
		projected[name] = record[name] ?? "";
	}
	return projected;
}

function resolveSearchFields(
	params: URLSearchParams,
	dataset: Dataset,
): string[] {
	const fieldSet = new Set(dataset.fields);
	const raw = params.get("searchFields");
	if (!raw) return [...dataset.fields];
	const requested = splitCsv(raw).filter((name) => fieldSet.has(name));
	return requested.length > 0 ? requested : [...dataset.fields];
}

function buildSearch(
	params: URLSearchParams,
	dataset: Dataset,
): { clause: string; values: string[] } {
	const term = params.get("q") ?? params.get("search");
	if (!term || term.length === 0) return { clause: "", values: [] };

	const fields = resolveSearchFields(params, dataset);
	const parts: string[] = [];
	const values: string[] = [];
	for (const field of fields) {
		const column = dataset.columnMap.get(field) ?? field;
		parts.push(`${quoteIdent(column)} LIKE '%' || ? || '%'`);
		values.push(term);
	}
	if (parts.length === 0) return { clause: "", values: [] };
	return { clause: `(${parts.join(" OR ")})`, values };
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
		const filterValues = splitCsv(value);
		if (filterValues.length === 0) continue;

		const column = dataset.columnMap.get(key) ?? key;
		const col = quoteIdent(column);
		const valueClauses = filterValues.map((filterValue) => {
			values.push(filterValue, filterValue);
			return `(${col} = ? OR (',' || REPLACE(${col}, ', ', ',') || ',') LIKE '%,' || ? || ',%')`;
		});
		parts.push(`(${valueClauses.join(" OR ")})`);
	}

	const search = buildSearch(params, dataset);
	if (search.clause) {
		parts.push(search.clause);
		values.push(...search.values);
	}

	if (parts.length === 0) return { clause: "", values: [] };
	return { clause: `WHERE ${parts.join(" AND ")}`, values };
}

function buildOrderBy(params: URLSearchParams, dataset: Dataset): string {
	const sort = params.get("sort");
	if (!sort || !dataset.fields.includes(sort)) return "";
	const column = dataset.columnMap.get(sort) ?? sort;
	const orderRaw = (params.get("order") ?? "asc").toLowerCase();
	const order = orderRaw === "desc" ? "DESC" : "ASC";
	return `ORDER BY ${quoteIdent(column)} ${order}`;
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
	const orderBy = buildOrderBy(params, dataset);
	const table = quoteIdent(dataset.tableName);

	const countRow = prepare(
		`SELECT COUNT(*) AS total FROM ${table} ${clause}`,
	).get(...values) as { total: number };
	const total = Number(countRow.total);
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const start = (page - 1) * limit;

	const rows = prepare(
		`SELECT * FROM ${table} ${clause} ${orderBy} LIMIT ? OFFSET ?`,
	).all(...values, limit, start) as Array<Record<string, string | null>>;

	return {
		dataset: dataset.name,
		page,
		limit,
		total,
		totalPages,
		data: rows.map((row) =>
			projectFields(rowToRecord(row, dataset), params, dataset),
		),
	};
}

export function findById(
	dataset: Dataset,
	id: string,
	params: URLSearchParams = new URLSearchParams(),
): DataRecord | undefined {
	const idColumn = dataset.columnMap.get(dataset.idField) ?? dataset.idField;
	const row = prepare(
		`SELECT * FROM ${quoteIdent(dataset.tableName)} WHERE ${quoteIdent(idColumn)} = ? LIMIT 1`,
	).get(id) as Record<string, string | null> | null;

	if (!row) return undefined;
	return projectFields(rowToRecord(row, dataset), params, dataset);
}
