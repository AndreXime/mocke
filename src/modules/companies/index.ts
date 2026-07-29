import type { OpenAPIHono } from "@hono/zod-openapi";
import { registerMockMutations } from "../shared/mock-mutations.js";
import { registerGetCompany } from "./api/get-company.js";
import { registerListCompanies } from "./api/list-companies.js";
import { companiesDocPage } from "./docs.js";

export function registerCompanies(app: OpenAPIHono): void {
	app.get("/companies", (c) => c.html(companiesDocPage));

	registerListCompanies(app);
	registerGetCompany(app);
	registerMockMutations(app, { name: "companies", tag: "Companies" });
}
