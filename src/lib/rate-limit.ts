import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { getConnInfo } from "hono/bun";

const LIMIT = 20;
const WINDOW_MS = 60_000;
const PRUNE_EVERY = 1_000;

interface WindowEntry {
	count: number;
	windowStart: number;
}

interface RateLimitResult {
	allowed: boolean;
	limit: number;
	remaining: number;
	resetAt: number;
}

const store = new Map<string, WindowEntry>();
let operationsSincePrune = 0;

export function getClientIp(c: Context): string {
	const forwarded = c.req.header("x-forwarded-for");
	if (forwarded) {
		const first = forwarded.split(",")[0]?.trim();
		if (first) return first;
	}

	try {
		const address = getConnInfo(c).remote.address;
		if (address) return address;
	} catch {
		// Bun.serve sem env.server no fetch
	}

	return "unknown";
}

function maybePrune(now: number): void {
	operationsSincePrune += 1;
	if (operationsSincePrune < PRUNE_EVERY) return;
	operationsSincePrune = 0;

	for (const [ip, entry] of store) {
		if (now - entry.windowStart >= WINDOW_MS) {
			store.delete(ip);
		}
	}
}

export function checkAndConsume(ip: string, now = Date.now()): RateLimitResult {
	maybePrune(now);

	const entry = store.get(ip);
	if (!entry || now - entry.windowStart >= WINDOW_MS) {
		store.set(ip, { count: 1, windowStart: now });
		return {
			allowed: true,
			limit: LIMIT,
			remaining: LIMIT - 1,
			resetAt: now + WINDOW_MS,
		};
	}

	if (entry.count >= LIMIT) {
		return {
			allowed: false,
			limit: LIMIT,
			remaining: 0,
			resetAt: entry.windowStart + WINDOW_MS,
		};
	}

	entry.count += 1;
	return {
		allowed: true,
		limit: LIMIT,
		remaining: LIMIT - entry.count,
		resetAt: entry.windowStart + WINDOW_MS,
	};
}

function setRateLimitHeaders(
	c: Context,
	result: RateLimitResult,
	includeRetryAfter = false,
): void {
	c.header("X-RateLimit-Limit", String(result.limit));
	c.header("X-RateLimit-Remaining", String(result.remaining));
	c.header("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

	if (includeRetryAfter) {
		const retryAfterSec = Math.max(
			1,
			Math.ceil((result.resetAt - Date.now()) / 1000),
		);
		c.header("Retry-After", String(retryAfterSec));
	}
}

export function setupRateLimit(app: OpenAPIHono): void {
	app.use("*", async (c, next) => {
		if (c.req.method === "OPTIONS") {
			return next();
		}

		const result = checkAndConsume(getClientIp(c));

		if (!result.allowed) {
			setRateLimitHeaders(c, result, true);
			return c.json(
				{ error: "Limite de requisições excedido. Tente novamente em breve." },
				429,
			);
		}

		setRateLimitHeaders(c, result);
		return next();
	});
}
