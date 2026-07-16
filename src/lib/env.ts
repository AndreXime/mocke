function parsePositiveInt(value: string | undefined, fallback: number): number {
	if (value === undefined || value === "") return fallback;
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
	return Math.floor(parsed);
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
	if (value === undefined || value === "") return fallback;
	const normalized = value.trim().toLowerCase();
	if (["1", "true", "yes", "on"].includes(normalized)) return true;
	if (["0", "false", "no", "off"].includes(normalized)) return false;
	return fallback;
}

export const env = {
	port: parsePositiveInt(process.env.PORT, 3000),
	trustProxy: parseBoolean(process.env.TRUST_PROXY, false),
	rateLimitMax: parsePositiveInt(process.env.RATE_LIMIT_MAX, 20),
	rateLimitWindowMs: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
} as const;
