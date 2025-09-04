# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./

# ---------- Dependencias de dev (para nodemon/tests en local) ----------
FROM base AS devdeps
ENV NODE_ENV=development
RUN npm ci

# ---------- (Opcional) Stage de tests ----------
FROM devdeps AS test
COPY . .
# Nota: NO pongas CMD aquí, o si lo pones, que NO sea el último stage del file
# CMD ["npm","test"]

# ---------- Producción: dependencias sin dev ----------
FROM base AS deps
ENV NODE_ENV=production
RUN npm ci --omit=dev

# ---------- Runner (PRODUCCIÓN) ----------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 4000
# MUY IMPORTANTE: este debe ser el CMD final
CMD ["npm","run","start:prod"]
