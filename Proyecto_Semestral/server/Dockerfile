FROM node:18-alpine

# Instalar postgresql-client para psql
RUN apk add --no-cache postgresql-client

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 5000

# Script de entrada que ejecuta init-db y luego inicia el servidor
CMD ["sh", "-c", "npm run init-db && npm start"]