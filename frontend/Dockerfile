# Usa una imagen base ligera de Node.js
FROM node:18-alpine 

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm install

# Copia el código fuente del frontend
COPY . .

# Expone el puerto de Vite (React/Vue usa el 5173 por defecto)
EXPOSE 5173

# Comando para ejecutar el frontend
CMD ["npm", "run", "dev"]
