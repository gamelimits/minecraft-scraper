FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.8.0 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile
COPY ./src/ ./src/
RUN pnpm build

FROM base AS production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist/ ./dist/
ENTRYPOINT ["pnpm", "start"]
