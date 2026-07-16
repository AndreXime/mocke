import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { getConnInfo } from "hono/bun";
import { env } from "./env.js";

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

function getSocketIp(c: Context): string | null {
	try {
		const address = getConnInfo(c).remote.address;
		return address ?? null;
	} catch {
		// Bun.serve sem env.server no fetch
		return null;
	}
}

export function getClientIp(c: Context): string {
	if (env.trustProxy) {
		const forwarded = c.req.header("x-forwarded-for");
		if (forwarded) {
			const first = forwarded.split(",")[0]?.trim();
			if (first) return first;
		}
	}

	return getSocketIp(c) ?? "unknown";
}

function maybePrune(now: number, windowMs: number): void {
	operationsSincePrune += 1;
	if (operationsSincePrune < PRUNE_EVERY) return;
	operationsSincePrune = 0;

	for (const [ip, entry] of store) {
		if (now - entry.windowStart >= windowMs) {
			store.delete(ip);
		}
	}
}

export function checkAndConsume(ip: string, now = Date.now()): RateLimitResult {
	const limit = env.rateLimitMax;
	const windowMs = env.rateLimitWindowMs;
	maybePrune(now, windowMs);

	const entry = store.get(ip);
	if (!entry || now - entry.windowStart >= windowMs) {
		store.set(ip, { count: 1, windowStart: now });
		return {
			allowed: true,
			limit,
			remaining: limit - 1,
			resetAt: now + windowMs,
		};
	}

	if (entry.count >= limit) {
		return {
			allowed: false,
			limit,
			remaining: 0,
			resetAt: entry.windowStart + windowMs,
		};
	}

	entry.count += 1;
	return {
		allowed: true,
		limit,
		remaining: limit - entry.count,
		resetAt: entry.windowStart + windowMs,
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

function shouldSkipRateLimit(c: Context): boolean {
	if (c.req.method === "OPTIONS") return true;
	const path = c.req.path;
	return path === "/health" || path === "/ready";
}

export function setupRateLimit(app: OpenAPIHono): void {
	app.use("*", async (c, next) => {
		if (shouldSkipRateLimit(c)) {
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
