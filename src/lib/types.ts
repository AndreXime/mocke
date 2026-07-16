export type Scalar = string | number | boolean | null;

export type FieldValue = Scalar | Scalar[] | Record<string, Scalar | Scalar[]>;

export type DataRecord = Record<string, FieldValue>;

export interface Dataset {
	name: string;
	source: string;
	format: "csv" | "json";
	idField: string;
	fields: string[];
	tableName: string;
	columnMap: Map<string, string>;
}

export interface PageResult<T = DataRecord> {
	dataset: string;
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	data: T[];
}
