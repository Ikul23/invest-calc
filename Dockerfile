FROM php:8.2-fpm

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    nginx \
    nodejs \
    npm \
    gnupg2 \
    && apt-get clean

# Установка PHP-расширений
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Рабочая директория
WORKDIR /var/www/html

# Копируем проект
COPY . .

# Копируем правильный .env-файл в зависимости от окружения
ARG APP_ENV=production
RUN if [ "$APP_ENV" = "production" ]; then cp .env.production .env; else cp .env .env; fi

# Установка зависимостей Laravel и фронта
RUN composer install --no-dev --optimize-autoloader \
    && npm install && npm run build

# Копируем Nginx конфиг
COPY docker/nginx/conf.d/app.conf /etc/nginx/sites-available/default

# Копируем и делаем start.sh исполняемым
COPY docker/php/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Порты и команда запуска
EXPOSE 80
CMD ["/usr/local/bin/start.sh"]
