
FROM node:22-alpine AS deps

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile



FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY package.json tsconfig.json ./
COPY src ./src
COPY drizzle ./drizzle

RUN bun run build



FROM node:22-alpine AS prod-deps

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production



FROM oven/bun:1-alpine AS production 
WORKDIR /app 

ENV NODE_ENV=production 

RUN apk add --no-cache libstdc++ 

COPY --from=prod-deps /app/node_modules ./node_modules 
COPY --from=build /app/dist ./dist 
COPY --from=build /app/drizzle ./drizzle 
COPY package.json ./ 

USER 1000 

CMD ["bun", "dist/index.js"]