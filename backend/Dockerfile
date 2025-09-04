# ---------- Base con dependencias del sistema ----------
FROM node:20-alpine AS base
WORKDIR /usr/src/app
ENV CI=true \
    NODE_ENV=production
# Instala utilidades mínimas (p.ej. para node-gyp si algún paquete lo necesita)
RUN apk add --no-cache python3 make g++

# ---------- Dependencias (cacheadas) ----------
FROM base AS deps
# Copiamos sólo archivos de dependencias para aprovechar el cache
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---------- Dependencias + Dev para test y desarrollo ----------
FROM base AS devdeps
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Build (si tienes TypeScript) ----------
# Si tu proyecto es JS puro, puedes omitir esta etapa y la copia de /dist
FROM devdeps AS build
# Copia el resto del código
COPY . .
# Si usas TypeScript, asegúrate de tener script "build"
# Si es JS puro, puedes comentar esta línea
RUN npm run build || echo "No build step, skipping"

# ---------- Imagen final (producción) ----------
FROM base AS runner
# Copiamos node_modules sin dev
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copiamos compilados si existen, si no, copia src directamente
# Prioriza dist/; si no existe, no falla gracias a `|| true`
COPY --from=build /usr/src/app/dist ./dist 2>/dev/null || true
COPY --from=build /usr/src/app/src ./src 2>/dev/null || true
COPY package.json ./

# Variables típicas
ENV NODE_ENV=production \
    PORT=4000

# Exponer el puerto de la app
EXPOSE 4000

# Comando de arranque:
# Si transpilas a dist, usa: node dist/index.js
# Si es JS puro en src, asegúrate que "start:prod" apunte a src/index.js o similar
CMD ["npm","run","start:prod"]

# ---------- Target para desarrollo (hot reload con nodemon) ----------
FROM devdeps AS dev
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]

# ---------- Target para tests ----------
FROM devdeps AS test
COPY . .
# Ejecuta pruebas y termina
CMD ["npm","test","--","--runInBand"]
