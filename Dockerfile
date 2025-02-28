# Etapa 1: Construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar solo archivos esenciales para aprovechar cacheo de capas
COPY package.json package-lock.json ./

# Instalar dependencias de producción y desarrollo necesarias para la build
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Etapa 2: Ejecución
FROM node:22-alpine AS runner

WORKDIR /app

# Copiar solo los archivos necesarios desde la fase de construcción
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Exponer el puerto de la API
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/main"]
