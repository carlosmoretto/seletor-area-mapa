# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração customizada do nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]