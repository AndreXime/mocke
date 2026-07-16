# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY package.json bun.lock tsconfig.json ./
COPY src ./src
RUN bun run build

FROM base AS release
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/dist ./dist
COPY package.json ./
COPY data ./data

RUN mkdir -p .cache && chown -R bun:bun /app

USER bun
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
	CMD bun -e "const p=process.env.PORT||'3000'; const r=await fetch('http://127.0.0.1:'+p+'/ready'); if(!r.ok) process.exit(1)"

CMD ["bun", "run", "start"]
