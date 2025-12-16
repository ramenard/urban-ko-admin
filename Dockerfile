FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Copier la configuration nginx AVANT de changer les permissions
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Modifier la config nginx pour qu'elle fonctionne en non-root
RUN sed -i 's/listen\s*80;/listen 8080;/' /etc/nginx/conf.d/default.conf && \
    # Créer les répertoires nécessaires
    mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    # Donner les permissions à nginx
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    # Modifier nginx.conf principal pour ne pas utiliser de PID file
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Modifier le nginx.conf principal
RUN sed -i '/user/d' /etc/nginx/nginx.conf && \
    sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
