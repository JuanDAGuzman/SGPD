FROM node:20-alpine AS base
WORKDIR /usr/src/app
ENV CI=true \
    NODE_ENV=production
RUN apk add --no-cache python3 make g++

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM base AS devdeps
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm ci

FROM devdeps AS build
COPY . .
RUN npm run build || echo "No build step, skipping"

FROM base AS runner
COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/dist ./dist 2>/dev/null || true
COPY --from=build /usr/src/app/src ./src 2>/dev/null || true
COPY package.json ./

ENV NODE_ENV=production \
    PORT=4000

EXPOSE 4000


CMD ["npm","run","start:prod"]

FROM devdeps AS dev
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]

FROM devdeps AS test
COPY . .
CMD ["npm","test","--","--runInBand"]
