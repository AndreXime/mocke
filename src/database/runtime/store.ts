import type { Database } from "bun:sqlite";
import type { Dataset } from "../../lib/types.js";
import { mapFieldColumns } from "../init/sqlite.js";
import { syncDatasets } from "../init/sync.js";

let db: Database;
const datasetsByName = new Map<string, Dataset>();

function loadDatasetCache(database: Database): void {
	datasetsByName.clear();
	const rows = database
		.query(
			`SELECT name, source, format, id_field, fields, table_name FROM _datasets`,
		)
		.all() as Array<{
		name: string;
		source: string;
		format: "csv" | "json";
		id_field: string;
		fields: string;
		table_name: string;
	}>;

	for (const row of rows) {
		const fields = JSON.parse(row.fields) as string[];
		datasetsByName.set(row.name, {
			name: row.name,
			source: row.source,
			format: row.format,
			idField: row.id_field,
			fields,
			tableName: row.table_name,
			columnMap: mapFieldColumns(fields),
		});
	}
}

db = await syncDatasets();
loadDatasetCache(db);

export function getDb(): Database {
	return db;
}

export function getDatasetMeta(name: string): Dataset | null {
	return datasetsByName.get(name) ?? null;
}
