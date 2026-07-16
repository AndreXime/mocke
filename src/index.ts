import app from "./app.js";
import { assertDatasetContracts } from "./modules/shared/contracts.js";

assertDatasetContracts();

const PORT = Number(process.env.PORT) || 3000;

const server = Bun.serve({
	fetch: app().fetch,
	port: PORT,
});

// Retorna os ms decorridos desde o boot do processo do Bun
const startupTime = performance.now();

console.log(`Servidor escutando em http://localhost:${server.port}`);
console.log(`Servidor iniciou em ${startupTime.toFixed(2)}ms`);
