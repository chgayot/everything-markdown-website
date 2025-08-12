# --- Builder ---
FROM node:24-alpine AS builder
WORKDIR /app
ENV CI=1

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# --- NGINX Runtime ---
FROM nginx:alpine

# Remove default conf and add our SPA config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
