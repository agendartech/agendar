# syntax=docker/dockerfile:1

# ---------- deps (todas, inclusive dev, para o build) ----------
FROM oven/bun:1.2-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---------- build (tsup -> dist) ----------
FROM deps AS build
WORKDIR /app
COPY tsconfig.json tsup.config.ts ./
COPY src ./src
RUN bun run build

# ---------- deps de producao ----------
FROM oven/bun:1.2-slim AS prod-deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ---------- runtime ----------
FROM node:24-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

RUN groupadd --system app && useradd --system --gid app --home-dir /app app

COPY --from=prod-deps --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist
COPY --chown=app:app drizzle ./drizzle
COPY --chown=app:app package.json ./

USER app
EXPOSE 3333

# Healthcheck bate na rota /health ja existente no server.ts
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3333)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Migrations rodam no boot do proprio container: o pre-deployment command do
# Coolify e pulado quando ainda nao existe container em execucao (1o deploy).
CMD ["sh", "-c", "node dist/db/migrate.mjs && exec node dist/server.mjs"]
