export type Scalar = string | number | boolean | null;

export type FieldValue = Scalar | Scalar[] | Record<string, Scalar | Scalar[]>;

export type DataRecord = Record<string, FieldValue>;

export interface Dataset {
	name: string;
	source: string;
	format: "csv" | "json";
	idField: string;
	fields: string[];
	records: DataRecord[];
}

export interface PageResult {
	dataset: string;
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	data: DataRecord[];
}
