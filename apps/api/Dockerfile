FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @ovgs/api db:generate
RUN pnpm --filter @ovgs/api build

EXPOSE 3333

CMD ["pnpm", "--filter", "@ovgs/api", "start"]
