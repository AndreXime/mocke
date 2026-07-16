import type { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import type { DataRecord } from "../../lib/types.js";
import { cellToText, fileFormat, loadDataFile } from "./parse.js";
import {
	CACHE_DIR,
	DATA_DIR,
	DB_PATH,
	DB_TMP_PATH,
	datasetTableName,
	mapFieldColumns,
	openDatabase,
	quoteIdent,
	readMetaHash,
} from "./sqlite.js";

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

function detectIdField(fields: string[]): string {
	for (const candidate of ID_CANDIDATES) {
		if (fields.includes(candidate)) return candidate;
	}
	return fields[0] ?? "id";
}

function datasetNameFromFile(fileName: string): string {
	return fileName.replace(/\.(csv|json)$/i, "");
}

interface DataFileInfo {
	fileName: string;
	size: number;
	mtimeMs: number;
}

async function listDataFiles(): Promise<DataFileInfo[]> {
	let names: string[];
	try {
		names = await readdir(DATA_DIR);
	} catch {
		return [];
	}

	const dataFiles = names
		.filter((name) => /\.(csv|json)$/i.test(name))
		.sort((a, b) => a.localeCompare(b));

	const infos: DataFileInfo[] = [];
	for (const fileName of dataFiles) {
		const fileStat = await stat(join(DATA_DIR, fileName));
		if (!fileStat.isFile()) continue;
		infos.push({
			fileName,
			size: fileStat.size,
			mtimeMs: Math.trunc(fileStat.mtimeMs),
		});
	}
	return infos;
}

function computeManifestHash(files: DataFileInfo[]): string {
	const lines = files.map(
		(file) => `${file.fileName}|${file.size}|${file.mtimeMs}`,
	);
	return createHash("sha256").update(lines.join("\n")).digest("hex");
}

function initSchema(database: Database): void {
	database.run(`
		CREATE TABLE _meta (
			key TEXT PRIMARY KEY NOT NULL,
			value TEXT NOT NULL
		);
	`);
	database.run(`
		CREATE TABLE _datasets (
			name TEXT PRIMARY KEY NOT NULL,
			source TEXT NOT NULL,
			format TEXT NOT NULL,
			id_field TEXT NOT NULL,
			fields TEXT NOT NULL,
			table_name TEXT NOT NULL
		);
	`);
}

function collectFields(records: DataRecord[]): string[] {
	const fieldSet = new Set<string>();
	for (const record of records) {
		for (const key of Object.keys(record)) fieldSet.add(key);
	}
	return [...fieldSet];
}

function importDataset(
	database: Database,
	fileName: string,
	records: DataRecord[],
): void {
	const format = fileFormat(fileName);
	const name = datasetNameFromFile(fileName);
	const fields = collectFields(records);
	const idField = detectIdField(fields);
	const tableName = datasetTableName(name);
	const columnMap = mapFieldColumns(fields);
	const sqlColumns = fields.map((field) => columnMap.get(field) ?? field);

	const columnDefs =
		sqlColumns.length > 0
			? sqlColumns.map((column) => `${quoteIdent(column)} TEXT`).join(", ")
			: `${quoteIdent("_row")} TEXT`;
	database.run(`CREATE TABLE ${quoteIdent(tableName)} (${columnDefs})`);

	if (records.length > 0 && sqlColumns.length > 0) {
		const placeholders = sqlColumns.map(() => "?").join(", ");
		const insertSql = `INSERT INTO ${quoteIdent(tableName)} (${sqlColumns
			.map(quoteIdent)
			.join(", ")}) VALUES (${placeholders})`;
		const insert = database.prepare(insertSql);
		for (const row of records) {
			insert.run(...fields.map((field) => cellToText(row[field])));
		}
	}

	database
		.prepare(
			`INSERT INTO _datasets (name, source, format, id_field, fields, table_name)
			 VALUES (?, ?, ?, ?, ?, ?)`,
		)
		.run(name, fileName, format, idField, JSON.stringify(fields), tableName);
}

async function buildDatabase(
	files: DataFileInfo[],
	hash: string,
): Promise<void> {
	await mkdir(CACHE_DIR, { recursive: true });
	await rm(DB_TMP_PATH, { force: true });

	const tmp = openDatabase(DB_TMP_PATH);
	try {
		initSchema(tmp);

		for (const file of files) {
			const format = fileFormat(file.fileName);
			const records = await loadDataFile(join(DATA_DIR, file.fileName), format);
			const importOne = tmp.transaction(() => {
				importDataset(tmp, file.fileName, records);
			});
			importOne();
		}

		tmp
			.prepare("INSERT INTO _meta (key, value) VALUES (?, ?)")
			.run("data_hash", hash);
		tmp.close();
		await rename(DB_TMP_PATH, DB_PATH);
	} catch (error) {
		try {
			tmp.close();
		} catch {
			/* already closed */
		}
		await rm(DB_TMP_PATH, { force: true });
		throw error;
	}
}

export async function syncDatasets(): Promise<Database> {
	const files = await listDataFiles();
	const hash = computeManifestHash(files);

	await mkdir(CACHE_DIR, { recursive: true });

	const existing = Bun.file(DB_PATH);
	if (await existing.exists()) {
		const current = openDatabase(DB_PATH);
		const storedHash = readMetaHash(current);
		if (storedHash === hash) {
			return current;
		}
		current.close();
	}

	try {
		await buildDatabase(files, hash);
	} catch (error) {
		if (await Bun.file(DB_PATH).exists()) {
			console.error(
				"Falha ao sincronizar datasets; mantendo SQLite anterior.",
				error,
			);
			return openDatabase(DB_PATH);
		}
		throw error;
	}

	return openDatabase(DB_PATH);
}
