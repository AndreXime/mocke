import type { OpenAPIHono } from "@hono/zod-openapi";
import { getDatasetMeta, getDb } from "../../database/runtime/store.js";
import { datasetSchemas } from "../shared/catalog.js";

const EXPECTED_DATASETS = Object.keys(datasetSchemas);

export function registerHealth(app: OpenAPIHono): void {
	app.get("/health", (c) => c.json({ status: "ok" }));

	app.get("/ready", (c) => {
		try {
			getDb().query("SELECT 1").get();
		} catch {
			return c.json(
				{ status: "not_ready", reason: "database_unavailable" },
				503,
			);
		}

		const missing = EXPECTED_DATASETS.filter(
			(name) => getDatasetMeta(name) === null,
		);

		if (missing.length > 0) {
			return c.json(
				{ status: "not_ready", reason: "datasets_missing", missing },
				503,
			);
		}

		return c.json({ status: "ok", datasets: EXPECTED_DATASETS });
	});
}
