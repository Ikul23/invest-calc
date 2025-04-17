FROM php:8.2-fpm

# Установка системных пакетов
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    gnupg2 \
    nginx \
    nodejs \
    npm

# PHP расширения
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Установка рабочего каталога
WORKDIR /var/www

# Копирование исходников
COPY . .

# Установка PHP и JS зависимостей
RUN composer install --no-dev --optimize-autoloader \
    && npm install \
    && npm run build

# Копирование Nginx-конфига
COPY docker/nginx/conf.d/app.conf /etc/nginx/sites-available/default

# Открытие порта
EXPOSE 80

# Копирование и настройка стартового скрипта
COPY docker/php/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Запуск
CMD ["/usr/local/bin/start.sh"]
