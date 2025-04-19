# Этап сборки фронтенда
FROM node:20-alpine AS node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY resources/ ./resources/
COPY vite.config.js ./
RUN npm run build

# Основной образ PHP
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    bash \
    supervisor \
    nodejs npm

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . /var/www
COPY --from=node /app/public/build /var/www/public/build

COPY docker/php/start.sh /start.sh
RUN chmod +x /start.sh

RUN chmod -R 777 /var/www/storage /var/www/bootstrap/cache

WORKDIR /var/www

EXPOSE 9000
CMD ["/start.sh"]
