function parsePositiveInt(value: string | undefined, fallback: number): number {
	if (value === undefined || value === "") return fallback;
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
	return Math.floor(parsed);
}

export const env = {
	port: parsePositiveInt(process.env.PORT, 3000),
	rateLimitMax: parsePositiveInt(process.env.RATE_LIMIT_MAX, 20),
	rateLimitWindowMs: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
} as const;
