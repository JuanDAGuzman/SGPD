# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./

# ---------- Dependencias de dev ----------
FROM base AS devdeps
ENV NODE_ENV=development
RUN npm ci

# ---------- (Opcional) Stage de tests ----------
FROM devdeps AS test
COPY . .
# NO pongas CMD aquí

# ---------- Producción: dependencias sin dev ----------
FROM base AS deps
ENV NODE_ENV=production
RUN npm ci --omit=dev

# ---------- >>> NUEVO: Stage de desarrollo (para compose) ----------
FROM devdeps AS dev
WORKDIR /usr/src/app
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]

# ---------- Runner (PRODUCCIÓN) ----------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["npm","run","start:prod"]
