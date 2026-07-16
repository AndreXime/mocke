import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

const server = Bun.serve({
	fetch: app().fetch,
	port: PORT,
});

console.log(`Mockê em http://localhost:${server.port}`);
