FROM oven/bun:1-alpine AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN bun install -g yarn@1.22.22 \
    && yarn config set registry https://registry.npmjs.org/ \
    && yarn config set strict-ssl false \
    && yarn install --frozen-lockfile

FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json yarn.lock tsconfig.json ./
COPY src ./src
COPY drizzle ./drizzle
RUN bun install -g yarn@1.22.22 \
    && yarn config set registry https://registry.npmjs.org/ \
    && yarn config set strict-ssl false \
    && yarn build

FROM oven/bun:1-alpine AS production-dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN bun install -g yarn@1.22.22 \
    && yarn config set registry https://registry.npmjs.org/ \
    && yarn config set strict-ssl false \
    && yarn install --frozen-lockfile --production

FROM oven/bun:1-distroless AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-dependencies --chown=1000:1000 /app/node_modules ./node_modules
COPY --from=build --chown=1000:1000 /app/dist ./dist
COPY --from=build --chown=1000:1000 /app/drizzle ./drizzle
COPY --chown=1000:1000 package.json ./
USER 1000:1000
EXPOSE 3000
CMD ["bun", "dist/index.js"]