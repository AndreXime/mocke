import app from "./app.js";
import { assertDatasetContracts } from "./modules/shared/contracts.js";

assertDatasetContracts();

const PORT = Number(process.env.PORT) || 3000;

const server = Bun.serve({
	fetch: app().fetch,
	port: PORT,
});

console.log(`Mockê em http://localhost:${server.port}`);
