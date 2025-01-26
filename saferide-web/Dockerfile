# Usa la versión más reciente de Node.js (v18 o superior)
FROM node:18-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias de la aplicación
RUN npm install --legacy-peer-deps

# Copiamos el resto del código de la aplicación
COPY . .

# Construimos la aplicación Angular para producción
RUN npm run build

# Usamos una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copiamos los archivos construidos en el contenedor Nginx
COPY --from=build /app/dist/Saferide /usr/share/nginx/html

# Exponemos el puerto 80 para acceder a la aplicación
EXPOSE 80

# Iniciamos Nginx para servir la aplicación
CMD ["nginx", "-g", "daemon off;"]
