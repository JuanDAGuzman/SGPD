# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /usr/src/app
# utilidades que a veces requieren node-gyp
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./

# ---------- Dependencias de desarrollo ----------
FROM base AS devdeps
ENV NODE_ENV=development
RUN npm ci

# ---------- (opcional) Stage de tests (sin CMD) ----------
FROM devdeps AS test
COPY . .
# Importante: NO poner CMD aquí

# ---------- Dependencias de producción (sin dev) ----------
FROM base AS deps
ENV NODE_ENV=production
RUN npm ci --omit=dev

# ---------- Stage de desarrollo para docker-compose (hot reload) ----------
FROM devdeps AS dev
WORKDIR /usr/src/app
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]

# ---------- Runner (PRODUCCIÓN)  ✅ ÚLTIMO STAGE ----------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["npm","run","start:prod"]
