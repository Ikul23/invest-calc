# Этап сборки фронтенда
FROM node:20-alpine AS node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY resources/ ./resources/
COPY vite.config.js ./
COPY jsconfig.json ./jsconfig.json
COPY public/ ./public/
RUN npm run build

RUN cp public/build/.vite/manifest.json public/build/manifest.json


# Основной образ PHP
FROM php:8.2-fpm

# Установка зависимостей
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
    nodejs \
    npm

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка PHP-расширений
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Копирование кода
COPY . /var/www
COPY --from=node /app/public/build /var/www/public/build

COPY .env.production /var/www/.env

WORKDIR /var/www

# Установка зависимостей Laravel (для production)
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# Права
RUN chmod -R 777 /var/www/storage /var/www/bootstrap/cache

# Стартовый скрипт
COPY docker/php/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 9000
CMD ["/start.sh"]
