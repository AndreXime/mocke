import type { DataRecord, Dataset, PageResult } from "../lib/types.js";

const RESERVED_PARAMS = new Set(["page", "limit"]);

function matchesEquality(
	record: DataRecord,
	field: string,
	expected: string,
): boolean {
	const actual = record[field];
	if (actual === undefined) return false;
	if (actual === null)
		return expected === "" || expected.toLowerCase() === "null";
	if (Array.isArray(actual)) {
		return actual.map(String).includes(expected);
	}
	if (typeof actual === "object") {
		return JSON.stringify(actual) === expected;
	}
	return String(actual) === expected;
}

function splitFilterValues(raw: string): string[] {
	return raw
		.split(",")
		.map((part) => part.trim())
		.filter((part) => part.length > 0);
}

export function filterRecords(
	records: DataRecord[],
	params: URLSearchParams,
	fields: string[],
): DataRecord[] {
	const fieldSet = new Set(fields);
	const filters: Array<{ field: string; values: string[] }> = [];

	for (const [key, value] of params.entries()) {
		if (RESERVED_PARAMS.has(key)) continue;
		if (!fieldSet.has(key)) continue;
		const values = splitFilterValues(value);
		if (values.length === 0) continue;
		filters.push({ field: key, values });
	}

	if (filters.length === 0) return records;

	return records.filter((record) =>
		filters.every(({ field, values }) =>
			values.some((value) => matchesEquality(record, field, value)),
		),
	);
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
	const filtered = filterRecords(dataset.records, params, dataset.fields);
	const total = filtered.length;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const start = (page - 1) * limit;

	return {
		dataset: dataset.name,
		page,
		limit,
		total,
		totalPages,
		data: filtered.slice(start, start + limit),
	};
}

export function findById(dataset: Dataset, id: string): DataRecord | undefined {
	return dataset.records.find(
		(record) => String(record[dataset.idField]) === id,
	);
}
