FROM php:8.2-fpm AS app

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    git curl unzip zip libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Установка Node.js для фронта
FROM node:20-alpine AS node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY resources/ ./resources/
COPY vite.config.js ./
RUN npm run build

# Возвращаемся к PHP
FROM php:8.2-fpm

# Установка composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Копируем проект
COPY . /var/www
COPY --from=node /app/public/build /var/www/public/build

# Установка зависимостей Laravel
WORKDIR /var/www
RUN composer install --no-dev --optimize-autoloader

# Права
RUN chmod -R 777 /var/www/storage /var/www/bootstrap/cache

# Копируем стартовый скрипт
COPY docker/php/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
