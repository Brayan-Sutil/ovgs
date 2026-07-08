FROM node:22-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:3333
ARG NEXT_PUBLIC_USER_ROLE=MASTER_ADMIN
ARG NEXT_PUBLIC_USER_ID=demo-master-admin
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_USER_ROLE=$NEXT_PUBLIC_USER_ROLE
ENV NEXT_PUBLIC_USER_ID=$NEXT_PUBLIC_USER_ID

RUN apk add --no-cache openssl
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @ovgs/web build

EXPOSE 3000

CMD ["pnpm", "--filter", "@ovgs/web", "start"]
