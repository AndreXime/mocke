import { Database } from "bun:sqlite";
import { join } from "node:path";

export const DATA_DIR = join(process.cwd(), "data");
export const CACHE_DIR = join(process.cwd(), ".cache");
export const DB_PATH = join(CACHE_DIR, "mocke.sqlite");
export const DB_TMP_PATH = join(CACHE_DIR, "mocke.sqlite.tmp");

const RESERVED_SQL = new Set([
	"_meta",
	"_datasets",
	"table",
	"index",
	"select",
	"from",
	"where",
	"group",
	"order",
	"limit",
	"offset",
	"join",
	"insert",
	"update",
	"delete",
	"create",
	"drop",
	"alter",
]);

export function sanitizeSqlIdentifier(raw: string): string {
	let cleaned = raw.replace(/[^a-zA-Z0-9_]/g, "_");
	if (!cleaned || /^\d/.test(cleaned)) cleaned = `c_${cleaned}`;
	if (RESERVED_SQL.has(cleaned.toLowerCase())) cleaned = `c_${cleaned}`;
	return cleaned;
}

/** Maps original field names to unique SQL column names. */
export function mapFieldColumns(fields: string[]): Map<string, string> {
	const used = new Set<string>();
	const map = new Map<string, string>();

	for (const field of fields) {
		let column = sanitizeSqlIdentifier(field);
		if (used.has(column)) {
			let suffix = 2;
			while (used.has(`${column}_${suffix}`)) suffix += 1;
			column = `${column}_${suffix}`;
		}
		used.add(column);
		map.set(field, column);
	}

	return map;
}

export function datasetTableName(datasetName: string): string {
	return `ds_${sanitizeSqlIdentifier(datasetName)}`;
}

export function quoteIdent(identifier: string): string {
	return `"${identifier.replaceAll('"', '""')}"`;
}

export function openDatabase(path: string): Database {
	return new Database(path, { create: true, strict: true });
}

export function readMetaHash(db: Database): string | null {
	try {
		const row = db
			.query("SELECT value FROM _meta WHERE key = ?")
			.get("data_hash") as { value: string } | null;
		return row?.value ?? null;
	} catch {
		return null;
	}
}
